function doGet(e) {
  var result = getExpenses(); // Fetch data from the sheet
  return buildResponse(result);
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var result = addExpense(params);
    return buildResponse(result);
  } catch (error) {
    return buildResponse("Invalid Request", 400);
  }
}

function doOptions(e) {
  return HtmlService.createHtmlOutput("")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

// Helper function to return a proper response with CORS headers
function buildResponse(content, statusCode = 200) {
  var response = {
    status: statusCode,
    data: content
  };

  var jsonOutput = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  return jsonOutput;
}

function addExpense(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expenses");
  if (!sheet) return "Sheet not found";

  sheet.appendRow([new Date(), data.amount, data.category, data.note]);
  return "Expense Added";
}

function getExpenses() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expenses");
  if (!sheet) return "Sheet not found";

  var data = sheet.getDataRange().getValues();
  return data; // Return array instead of JSON string to avoid double encoding
}
