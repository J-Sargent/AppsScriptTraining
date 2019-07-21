//function doGet(e) {
//  var params = JSON.stringify(e);
//  return HtmlService.createHtmlOutput(params);
// //}

function doGet(e) {
  Logger.log(e);
  var webappPage = HtmlService.createHtmlOutputFromFile("Webapp");
  //webappPage.append("<p>" + variableName + "</p>");
  return webappPage;
}

var filterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
  "Filter"
);

function getSummaries() {
  var x = filterSheet
    .getRange("N2")
    .getDataRegion(SpreadsheetApp.Dimension.ROWS)
    .getNumRows();
  var newRange = "N2:N" + x;
  var summaryData = filterSheet.getRange(newRange).getDisplayValues();
  return summaryData;
}
