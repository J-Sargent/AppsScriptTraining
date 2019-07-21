function onEdit(e) {
  if (e.range.getColumn() == 9 && e.value[0] !== undefined) {
    var date = new Date();
    Utilities.formatDate(date, 'CST', 'MM/dd/yyyy');
    var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filter').getRange(e.range.getRow(),1,1,9).getDisplayValues();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
    var lastRow = sheet.getLastRow();
    
    data[0][9] = date;
    sheet.getRange(lastRow + 1,1,1,data[0].length).setValues(data);
  }
  else if (e.range.getColumn() == 9 && e.value[0] === undefined) {
    var callId = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filter').getRange(e.range.getRow(),1).getDisplayValue();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
    var data = sheet.getDataRange().getDisplayValues();
    
    data.forEach(function (row,index) {
      if (row[0] == callId) {
        sheet.deleteRow(index+1);
      }
    });
  }
}

function nameFix() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ContactHistory');
  var sheet = ss.getDataRange().getDisplayValues();
  
  for (var x=0; x<sheet.length; x++) {
    if (sheet[x][3] == 'Re&#39;Chiele Moorman') {
      sheet[x][3] = 'Re\'Chiele Moorman';
    }
    else if (sheet[x][3] == 'Justin Navarro' || sheet[x][3] == "Brittney Richardson") {
      sheet.splice(x,1);
      x--;
    }
  }
  ss.getRange(1,1,sheet.length,sheet[0].length).setValues(sheet);  
  
  ss.deleteColumns(11,3);
  ss.deleteColumn(5).deleteColumn(3).deleteColumn(2);
  ss.sort(2);
  
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filter').getRange('A2').setFormula('=FILTER(ContactHistory!A:G,ContactHistory!A:A<>"",ContactHistory!G:G>0.1,ContactHistory!G:G<0.9)');
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filter').getRange('I2:I').clearContent();
}

// Create custom menus
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Import')
    .addItem('Clean the Data', 'menuItem1')
    .addToUi();  
}

// Custom menu item 1 (QA Quote, runs the quote function)
function menuItem1() {
  nameFix();
}

function encoder(callId) {
  var url = 'https://us1.mediavaultplus.com/scdownload?query=';
  
  var params = 'domainid=35&domain=SelectQuoteAutoHome&key=MEDIAVAULT12345654219&media=';
  params += callId;
  
  url += Utilities.base64Encode(params);
  
  return url;
}
