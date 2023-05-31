//Global Variable for Response
const audit_data = {};

//Receive message from popup.js and send a reply
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    script_audit();
    sendResponse(audit_data);
});

//Function to run audit on script page
function script_audit() {
    console.log("Executing Script Audit");

    //Variable declarations
    var script_code = '';
    available_custom_fields = [];
    script_fields = [];
    nsoa_object_array = [];
    valid_custom_fields = [];
    audit_data.selected_custom_fields = [];
    audit_data.invalid_custom_fields = {};
    audit_data.missing_custom_fields = [];
    audit_data.unneeded_fields = [];
    audit_data.errors = 0;

    //Locate list of OA fields in the page html and build an array
    let options = document.getElementsByName("_available_custom_fields");
    for (var i = 0; i < options[0].length; i++) {
        var field = options[0][i].title.split('] ')[1];;
        available_custom_fields.push(field);
    };
    //console.log(available_custom_fields);

    //Locate list of selected OA fields in the page html and built an array
    let selected_options = document.getElementsByName("_selected_custom_fields");
    for (var i = 0; i < selected_options[0].length; i++) {
        var field = selected_options[0][i].title.split('] ')[1];;
        audit_data.selected_custom_fields.push(field);
    };
    //console.log(audit_data.selected_custom_fields);

    //Locate script code in the page html
    script_code = document.getElementById("test_code_id").textContent;
    //console.log(script_code);

    //Locate creation of NSOA objects in script and store the object names in an array
    let nsoa_new_object_indices = Array.from(script_code.matchAll(/new nsoa.record/gi));
    let nsoa_new_form_object_indices = Array.from(script_code.matchAll(/nsoa.form.getNewRecord/gi));
    let all_nsoa_object_indices = [...nsoa_new_object_indices,  ...nsoa_new_form_object_indices];
    for (let item in all_nsoa_object_indices){
        index = all_nsoa_object_indices[item].index;
        let slice = script_code.slice(index-50,index);
        let slice_array = slice.trim().split(/[\s=]+/);  //split string on spaces and equals
        for (i=0; i<slice_array.length; i++){
            if(slice_array[slice_array.length-i-1].length > 0){
                if( nsoa_object_array.indexOf(slice_array[slice_array.length-i-1]) === -1){
                     nsoa_object_array.push(slice_array[slice_array.length-i-1]);
                }
                break;
            }
        }
    }
    //console.log(nsoa_object_array);

    //Locate NSOA Wsapi read requests and store the object names in an array
    let nsoa_lookup_object_indices = Array.from(script_code.matchAll(/nsoa.wsapi.read/gi));
    for (let item in nsoa_lookup_object_indices){
        index = nsoa_lookup_object_indices[item].index;
        let slice = script_code.slice(index-50,index);
        let slice_array = slice.trim().split(/[\s=]+/);
        for (i=0; i<slice_array.length; i++){
            if(slice_array[slice_array.length-i-1].length > 0){
                if( nsoa_object_array.indexOf(slice_array[slice_array.length-i-1]) === -1){
                     nsoa_object_array.push(slice_array[slice_array.length-i-1]);
                }
                break;
            }
        }
    }
    //console.log( nsoa_object_array);

    //Find all fields in script that end in __c
    let all_script_fields = script_code.match(/([a-z0-9\[\]._]+)__c\b/gi);   //This will give you every field object that starts after a space or parentheses and ends in __c
    script_fields = all_script_fields.filter((item, index) => all_script_fields.indexOf(item) === index);  //remove duplicates
    //console.log(script_fields);

    //Check if custom field in script exists in OpenAir instance
    for (let field_index in script_fields){
        let field_parent = script_fields[field_index].split(/[\[.]+/)[0];
        let field = script_fields[field_index].split(".").slice(-1);
        let field_name = field.toString().slice(0,-3);
        if( nsoa_object_array.indexOf(field_parent) != -1){  //is field_parent a valid OA object
            if(available_custom_fields.indexOf(field_name) === -1) {  //does field NOT exist in available custom fields?
                let matches = script_code.matchAll(field);
                let rows = [];
                for (let match of matches) {
                    let match_slice = script_code.slice(0,match.index);
                    let match_lines = match_slice.split(/\r|\r\n|\n/);
                    let row_count = match_lines.length;
                    rows.push(row_count);
                }
                console.error("WARNING: FIELD " + field + " AT ROW(s) " + rows + " DOES NOT EXIST IN OPENAIR");
                audit_data.invalid_custom_fields[field] = [rows];
                audit_data.errors += 1;
            } else {
    //            console.log("Field " + field + " does exist in OpenAir");
                if(valid_custom_fields.indexOf(field[0]) === -1) {
                    valid_custom_fields.push(field[0]);
                }
            }
        }
    }
    //console.log("Custom field audit complete and found " + audit_data.errors + " errors.")

    //Check if custom field is missing from selected field list
    for (let field_index in valid_custom_fields) {
        let field = valid_custom_fields[field_index].slice(0,-3);
    //    console.log(field);
        if(audit_data.selected_custom_fields.includes(field)){
            continue;
    //        console.log("Field " + field + " is already selected");
        } else {
    //        console.log("Field " + field + " is not selected");
            audit_data.missing_custom_fields.push(field);
        }
    }
    if(audit_data.missing_custom_fields.length > 0){
        console.log("Field(s) " + audit_data.missing_custom_fields + " should be added to the selected fields list.");
    }else{
        console.log("The audit did not find any fields that need to be added to the selected fields list.")
    }

    //Check if a field should not be in the selected list
    for (let field_index in audit_data.selected_custom_fields) {
        let field = audit_data.selected_custom_fields[field_index] + "__c";
    //    console.log(field);
        if(valid_custom_fields.includes(field)){
            continue;
    //        console.log("Field " + field + " is used in the script");
        } else {
    //        console.log("Field " + field + " is not used in the script");
            audit_data.unneeded_fields.push(field);
        }
    }
    if(audit_data.unneeded_fields.length > 0){
        console.log("Field(s) " + audit_data.unneeded_fields + " should be removed from the selected fields list.");
    }else{
        console.log("The audit did not find any fields that need to be removed from the selected fields list.")
    }
}