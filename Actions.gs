var GOOGLE_SHEET_PARAMETERS = 'parameters';
var MONTH = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

var parametersSheet = SpreadsheetApp.getActive().getSheetByName(GOOGLE_SHEET_PARAMETERS);
var parametersRange = parametersSheet.getDataRange().getValues();
var parameters = initParameters();

function initParameters() {
  var parameters = {}
  for (var i = 0; i < parametersRange.length; i++) {
    parameters[parametersRange[i][0]] = parametersRange[i][1];
  }
  return parameters;
}

function formatDate(date) {
  return Utilities.formatDate(date,
    parameters.GOOGLE_DATE_REGION,
    parameters.GOOGLE_DATE_FORMAT);
}

function getCalendarEvents() {
  var date = new Date();
  date.setDate(date.getDate() - parameters.DIFF_DAYS);

  //YEAR/MONTH/DAY 
  var calendarStartDate = date.getFullYear() + "/" + MONTH[date.getMonth()] + "/" + date.getDate() + " 00:00:00 UTC";
  var calendarEndDate = date.getFullYear() + "/" + MONTH[date.getMonth()] + "/" + date.getDate() + " 23:59:59 UTC";
  Logger.log("Considering the following date: " + calendarStartDate);

  var cal = CalendarApp.getCalendarById(parameters.GOOGLE_CALENDAR_ID);
  var events = cal.getEvents(new Date(calendarStartDate), new Date(calendarEndDate));
  var sheet = SpreadsheetApp.getActive().getSheetByName(parameters.GOOGLE_SHEET_MAIN);
  var allPeople = getAllPeople();
  for (var i = 0; i < events.length; i++) {
    if (allPeople.findIndex(t => t.name.trim() === events[i].getTitle().trim()) >= 0) {
      var data = [
        events[i].getTitle(),
        events[i].getStartTime(),
        events[i].getEndTime(),
        allPeople[allPeople.findIndex(t => t.name.trim() === events[i].getTitle().trim())].value
      ];
      sheet.appendRow(data);
    }
  }
}

//IF YOU CHANGE THE COLUMNS POSITIONS, YOU MUST UPDATE HERE.
var INDEX_COLUMN_NAME = 0;
var INDEX_COLUMN_DATE = 1;
var INDEX_COLUMN_PRICE = 3
var INDEX_COLUMN_STATUS = 6;

var PAYMENT_STATUS_NOT_OK = "NOK";
var PAYMENT_STATUS_OK = "OK";

function getPeopleDataByStatusColumn(filter) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(parameters.GOOGLE_SHEET_MAIN);
  var range = sheet.getActiveRange().getValues();

  var peopleName = range[0][INDEX_COLUMN_NAME].toString().trim();
  Logger.log("Selected people: " + peopleName);
  var fullRange = sheet.getDataRange().getValues();

  var totalFormattedDays = "";
  var totalNumberDays = 0;
  var totalValue = 0;

  for (var i = 0; i < fullRange.length; i++) {

    if (fullRange[i][INDEX_COLUMN_NAME].toString().trim() === peopleName &&
      (fullRange[i][INDEX_COLUMN_STATUS].toString().trim() === filter)) {

      var day = fullRange[i][INDEX_COLUMN_DATE].toString().trim();

      totalNumberDays += 1;
      totalFormattedDays += formatDate(new Date(day)) + "<br/>";
      totalValue += fullRange[i][INDEX_COLUMN_PRICE];
    }
  }

  return {
    peopleName: peopleName,
    totalNumberDays: totalNumberDays,
    totalFormattedDays: totalFormattedDays,
    totalValue: totalValue
  }
}

function getPeopleDebits() {
  var result = getPeopleDataByStatusColumn(PAYMENT_STATUS_NOT_OK);

  var message = parameters.DEBIT_MESSAGE.toString().replace('{{name}}', result.peopleName)
    .replace("{{n}}", result.totalNumberDays)
    .replace("{{formatted_days}}", result.totalFormattedDays)
    .replace("{{total_value}}", result.totalValue);

  var htmlOutput = HtmlService
    .createHtmlOutput(message)
    .setWidth(350)
    .setHeight(300);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Result');
}

function getPeopleReceipts() {
  var result = getPeopleDataByStatusColumn(PAYMENT_STATUS_OK);

  if (result.totalValue > 0) {
    var pdfURL = getPDFforReceipt(result,
      result.totalValue,
      result.totalNumberDays,
      result.totalFormattedDays)

    var htmlOutput = HtmlService
      .createHtmlOutput("Your PDF is ready: <a href='" + pdfURL + "' target='__blank'>Download</a>")
      .setWidth(350)
      .setHeight(50);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Result');
  }
  else {
    var htmlOutput = HtmlService
      .createHtmlOutput("<h1>No data for " + result.peopleName + "!</h1>")
      .setWidth(350)
      .setHeight(150);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Result');
  }
}

function getAllPeople() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(parameters.GOOGLE_SHEET_NAME_PEOPLE);
  var range = sheet.getDataRange().getValues();
  var allPeople = [];

  Logger.log("Getting all people.")
  for (var i = 1; i < range.length; i++) {
    if (range[i][INDEX_COLUMN_NAME].toString().trim() !== "") {
      allPeople.push({
        name: range[i][INDEX_COLUMN_NAME].toString().trim(),
        value: range[i][1],
      });
    }
  }
  Logger.log(allPeople);
  return allPeople;
}

function getPDFforReceipt(peopleObject, totalValue, totalDays, totalFormattedDays) {
  var parameters = initParameters();
  var fileName = formatDate(new Date()) + "-" + peopleObject.peopleName + "-receipt";
  var newReceiptDocumentId = DriveApp.getFileById(parameters.GOOGLE_DOCS_RECEPIT_TEMPLATE_ID)
    .makeCopy(fileName).getId();

  var template = DocumentApp.openById(newReceiptDocumentId);
  var body = template.getBody()

  var months = eval(parameters.MONTHS)
  var today = new Date();

  //your info block
  body.replaceText("{{my_name}}", parameters.MY_NAME);
  body.replaceText("{{my_personal_info_1}}", parameters.MY_PERSONAL_INFO_1);
  body.replaceText("{{my_personal_info_2}}", parameters.MY_PERSONAL_INFO_2);
  body.replaceText("{{my_personal_info_3}}", parameters.MY_PERSONAL_INFO_3);
  body.replaceText("{{my_personal_info_4}}", parameters.MY_PERSONAL_INFO_4);
  body.replaceText("{{my_personal_info_5}}", parameters.MY_PERSONAL_INFO_5);

  //people's info block
  body.replaceText("{{name}}", peopleObject.peopleName);
  //body.replaceText("{{people_personal_info_1}}", peopleObject.peoplePersonalInfo1)
  body.replaceText("{{total_days}}", totalDays)
  body.replaceText("{{total_formatted_days}}", totalFormattedDays)
  body.replaceText("{{total_value}}", totalValue);

  //today's date block
  body.replaceText("{{day}}", today.getDate());
  body.replaceText("{{monthName}}", months[today.getMonth()]);
  body.replaceText("{{year}}", today.getFullYear());
  template.saveAndClose();

  var blob = template.getBlob().getAs('application/pdf').setName(fileName + '.pdf')
  var folder = DriveApp.getRootFolder();

  //Move the new generated google document to the trash.
  DriveApp.getFileById(newReceiptDocumentId).setTrashed(true);
  return folder.createFile(blob).getUrl();
}
