const sendMessageButton = document.getElementById("auditButton");
sendMessageButton.onclick = async function (e) {
    console.log("button clicked");

    //Reset auditResults element
    let auditResults = document.getElementById("auditResults");
    auditResults.remove();
    let results = document.getElementById("results");
    var newResults = document.createElement("ul");
    newResults.id = "auditResults";
    results.appendChild(newResults);

    //Identify tab in order to send request to content.js
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    console.log(tabs);

    //Send request to content.js and process response
    chrome.tabs.sendMessage(
        tabs[0].id,
        {},
        function (response) {
            console.log("Errors found during audit: " + response.errors);
            let results = document.getElementById("auditResults");
            var responseError = document.createElement("li");
            responseError.textContent = "Custom fields within the script have been audited and " + response.errors + " error(s) have been found.";
            var responseErrorFields = document.createElement("ul");
            if(Object.keys(response.invalid_custom_fields).length > 0){
                for(let field in response.invalid_custom_fields){
                    console.log(field);
                    var li = document.createElement("li");
                    li.textContent = field + " at line(s) " + response.invalid_custom_fields[field];
                    console.log(li.textContent);
                    responseErrorFields.appendChild(li);
                }
            }
            responseError.appendChild(responseErrorFields);
            results.appendChild(responseError);
            var responseAddFields = document.createElement("li");
            if(response.missing_custom_fields.length > 0){
                responseAddFields.textContent = "The audit found " + response.missing_custom_fields.length + " fields that should be added to the selected fields list.";
                var responseAddFieldsList = document.createElement("ul");
                for(let field of response.missing_custom_fields){
                    var li = document.createElement("li");
                    li.textContent = field;
                    responseAddFieldsList.appendChild(li);
                }
                responseAddFields.appendChild(responseAddFieldsList);
            }else{
                responseAddFields.textContent = "The audit did not find any fields that need to be added to the selected fields list."
            }
            results.appendChild(responseAddFields);
            var responseRemoveFields = document.createElement("li");
            if(response.unneeded_fields.length > 0){
                responseRemoveFields.textContent = "The audit found " + response.unneeded_fields.length + " fields that should be removed from the selected fields list.";
                var responseRemoveFieldsList = document.createElement("ul");
                for(let field of response.unneeded_fields){
                    var li = document.createElement("li");
                    li.textContent = field;
                    responseRemoveFieldsList.appendChild(li);
                }
                responseRemoveFields.appendChild(responseRemoveFieldsList);
            }else{
                responseRemoveFields.textContent = "The audit did not find any fields that need to be removed from the selected fields list."
            }
            results.appendChild(responseRemoveFields);
        }
    );
};