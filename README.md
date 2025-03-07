# Suite Projects Pro Script Custom Field Auditor

## Description

This project was used to learn how to build Chrome extensions generally and to solve a common problem with script deployments in Suite Projects Pro.  The extension will:

- Audit all custom fields within the script and verify if they exist in the Suite Projects Pro isntance.
- If a custom field is missing (or mispelled), the extension will will report an error, including the line of the missing field.
- Provide a list of any custom fields that should be added to the custom field list.
- Provide a list of any custom fields that should removed from the custom field list.

## Table of Contents (Optional)

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Testing](#testing)

## Installation and Setup

How to install an unpacked copy of the chrome extension (for testing or code review):
1)Copy the extenstion folder and all of its contents to a local drive (the root folder will contain the manifest)
2)Open Chrome, open settings, then open Extensions
3)Click "Load Unpacked" and select the folder that was copied in step 1
4)Chome must be closed and restarted.  This is required for the extension to "find" the current tab
5)(Optional) Click the extension icon (puzzle piece) in Chrome and pin the extension to the browser bar

## Usage

1)Navigate to the the Suite Projects Pro scripting center and open a script to view the script code
2)Click the Suite Projects Pro Script Custom Field Audit icon to open the extension, then click "Audit Script"
3)The extension will give feedback in the same popup window that included the audit button

## Credits

Link to Google Chrome Extension Guide and Tutorial: https://developer.chrome.com/docs/extensions/mv3/getstarted/

## License

MIT License

Copyright (c) 2023 Jonathan Sitterley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Testing

To test this extension, audit a script in Suite Projects Pro, then manually review the script code to validate that it found all errors.
- If errors are found, please email them to Jonathan Sitterley at jonathan.sitterley@gmail.com