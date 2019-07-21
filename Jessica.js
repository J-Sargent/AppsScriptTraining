////Inbound phone Logic: If Inbound area code is in the 400s, return "Salesforce"
////if area code is in the 800s return 'AWS'
////if area code is in the 900s return 'Firebase'
////else return 'Not backed up'
//
///*
// * Is called as a formula from within a cell
// * Params: phoneString, is passed in as a cell's value
// */
//function convertPhoneNumberToCRM(phoneString) {
//  // Your conversion code
//  return crmName;
//}

//var ui = SpreadsheetApp.getUi();
var filterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
  "Filter"
);
//var sheetData = filterSheet.getDataRange().getDisplayValues();

function flatten(arrayOfArrays) {
  //need this because appsscript doesn't have array.flat
  return [].concat.apply([], arrayOfArrays);
}

function whichCRM(number) {
  number = number.toString();
  var crmName;
  switch (number[0]) {
    case "8":
      crmName = "AWS";
      break;
    case "4":
      crmName = "Salesforce";
      break;
    case "9":
      crmName = "Firebase";
      break;
    default:
      crmName = "";
  }

  return crmName;
}

function createCRM(array) {
  var flatArray = flatten(array);
  var answer = flatArray.map(function(inboundNum) {
    var x = whichCRM(inboundNum);
    return [x];
  });
  return answer;
}

//TEST
function getHeaders(sheetName, headerLength) {
  var getHeaders = sheetName.getRange(1, 1, 1, headerLength).getDisplayValues();
  var headers = flatten(getHeaders);
  return headers;
}

function convertDate(theDate) {
  if (theDate instanceof Date && theDate.getYear() == 2017) {
    var a = Utilities.formatDate(theDate, "CMT", "MM/dd/yyyy");
    return a;
  } else if (theDate instanceof Date && theDate.getYear() < 1950) {
    var a = Utilities.formatDate(theDate, "PST", "kk:mm");
    return a;
  }
  return theDate;
}

function makeSummary(row, headers, lineBreak) {
  //both row and headers are arrays
  var messageString = "";
  for (var i = 0; i < row.length; i++) {
    string = convertDate(row[i]);
    string = string;
    if (string == "") {
      messageString;
    } else {
      messageString += headers[i] + ": " + string + lineBreak;
    }
  }
  return messageString;
}

function sheetSummary(array) {
  var arrayLength = array[0].length;
  var headers = getHeaders(filterSheet, arrayLength);
  var answer = array.map(function(row) {
    return [makeSummary(row, headers, "\n")];
  });
  return answer;
}

//TEST
function testMakeMessage() {
  Logger.log(makeMessage(filterSheet.getRange("A2:N2").getValues()));
}

/* STAGE 2:
  Turn the Summary line into an Apps Script Webapp (https://developers.google.com/apps-script/guides/web). Having the Chrome Console open can be a big help with errors sometimes.
  I want the webpage to load and only show each of the summaries separately. Formatting isn't important other than that.
  Bonus points for figuring out how to embed the entire spreadsheet into the Webapp somewhere on the page.
  Search for Embed Published Google Sheet.
  
  Total Score: 15 Points
  Total Bonus: 5 Points
  Score: 20 Points
*/

/*
  STAGE 3:
  Create a different page for the webapp, and serve that instead of Stage 2.
  This page is going to have 1 input, a start date range which will retrieve all of 
  the original data from ContactHistory which is after that date range, then apply your CRM 
  and Summary function logic to add 2 columns onto it.
  (Basically exactly what Filter is doing, except Drop columns J-N (if N is still Test column))
  Display all of this in a formatted table in the webapp. 
  (Try to make it looks decent, but doesn't have to be perfect. Write the CSS yourself,
  use others for demo but don't copy/paste)
  
  Bonus points for writing a function to determine the total date range of ContactHistory,
   and then using that to throw errors in the date input. 
  Even more bonus points if you can figure out how to store data long-term between script runs,
   so that we don't have to scan the Sheet EVERY TIME we want to know the date range. 
  *HINT* there are 3 different ways to do this in Apps Script. All 3 are fine, but 2 
  are faster than the 3rd.  
  
  Total Score: 20 Points
  Total Bonus: 25 Points
*/
