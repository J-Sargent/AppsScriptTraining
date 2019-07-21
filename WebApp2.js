var contactSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
  "ContactHistory"
);

function doGet(e) {
  var webappPage = HtmlService.createHtmlOutputFromFile("HTML2");
  return webappPage;
}

function contactHeaders() {
  var headers = getHeaders(contactSheet, 8); //getHeaders() is in Jessica.js, 8 is hardcoded
  headers.push("CRM");
  headers.push("Summary");
  return headers;
}

function fullRange() {
  Logger.log("fullRange called");
  var range = contactSheet.getRange("A2").getDataRegion();
  var allData = range.getDisplayValues();
  return allData;
}

function prepDataWithFullRange() {
  Logger.log("prepDataWithFullRange called");
  var allData = fullRange();
  var headers = allData.shift();
  headers.push("CRM");
  headers.push("Summary");
  processedData = calculateArray(allData, headers);
  processedData.unshift(headers);
  return processedData;
}

function calculateArray(array, headers) {
  Logger.log("calculateArray called");
  //var headers = contactHeaders();
  var answer = array.map(function(row) {
    // row.splice(5, 1, Utilities.formatDate(row[5], "CMT", "MM/dd/yyyy"));
    // row.splice(6, 1, Utilities.formatDate(row[6], "PST", "kk:mm"));
    row.push(whichCRM(row[3]));
    row.push(makeSummary(row, headers, "<br>"));
    return row;
  });
  return answer;
}

//TEST
function testCalculateArray() {
  var testRange = contactSheet.getRange("A2:H3").getValues();
  var x = calculateArray(testRange);
  // var w = new Date(2017, 11, 20, 10, 30);
  // var x = calculateArray([
  //   ["123", "Jessica", "9136537462", "8775347775", "landline", "w"]
  // ]);
  return x;
}

function prepDataWithSubmitDate(submittedDate) {
  submittedDate = new Date(submittedDate).getTime();
  Logger.log("submitted date after gettime " + submittedDate);
  var allData = fullRange();
  var headers = allData.shift();
  headers.push("CRM");
  headers.push("Summary");
  //var scriptProperties = PropertiesService.getScriptProperties();
  //var lastDate = scriptProperties.getProperty("LastUpdated");
  // Logger.log("lastdate " + lastDate);
  var filteredData = [];
  filteredData = allData.filter(function(row) {
    var date = new Date(row[5]).getTime();
    //var date = Utilities.formatDate(row[5], "CMT", "yyyy/MM/dd");
    return date >= submittedDate;
  });
  Logger.log("filteredData" + filteredData);
  processedData = calculateArray(filteredData, headers);
  processedData.unshift(headers);
  Logger.log(processedData);
  return processedData;
}

function submitDate(startDate) {
  Logger.log("startDate" + startDate);
  return startDate;
}

//store some sort of newest entry date in spreadsheet. longest
//something in spreadsheet documentat
//something in documentaiton near utnilites

function setInitialProperty() {
  Logger.log("setIntialProperties called");
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("LastUpdated", "01/10/1990");
  Logger.log(scriptProperties);
}

function updateProperty() {
  Logger.log("part2 called");
  var scriptProperties = PropertiesService.getScriptProperties();
  var allData = fullRange();
  var headers = allData.shift();

  var sorted = allData.sort(function(row1, row2) {
    var a = row1[5];
    var b = row2[5];

    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  });
  var lastDate = Utilities.formatDate(sorted[0][5], "CMT", "MM/dd/yyyy");
  scriptProperties.setProperty("LastUpdated", lastDate);
  var data = scriptProperties.getProperty("LastUpdated");
  Logger.log(data);
}

function getLastUpdate() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var data = scriptProperties.getProperty("LastUpdated");
  return data;
}
