var GOOGLE_SHEET_PARAMETERS = 'parameters';
var MONTH = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

var parametersSheet = SpreadsheetApp.getActive().getSheetByName(GOOGLE_SHEET_PARAMETERS);
var parametersRange = parametersSheet.getDataRange().getValues();
var parameters = initParameters();

function initParameters() {
  var parameters = {}
  for (let i = 0; i < parametersRange.length; i++) {
    parameters[parametersRange[i][0]] = parametersRange[i][1];
  }
  return parameters;
}

function formatDate(date) {
  return Utilities.formatDate(date,
    parameters.GOOGLE_DATE_REGION,
    parameters.GOOGLE_DATE_FORMAT);
}

function getPeopleIndex(array, peopleName) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name.trim() === peopleName.trim()) {
      return i;
    }
  }
  return -1;
}

// This function can be called manually, allowing the user to select the start and end dates to rebuild the spreadsheet.
function getCalendarEventsManual() {
  var calendarStartDate = SpreadsheetApp.getUi().prompt("Type a Start Date - Use the following format 2024/12/31");
  var calendarEndDate = SpreadsheetApp.getUi().prompt("Type a End Date - Use the following format 2024/12/31");

  const startDate = calendarStartDate.getResponseText();
  const endDate = calendarEndDate.getResponseText();

  Logger.log(startDate);
  Logger.log(endDate);

  if (calendarStartDate.getResponseText().trim() !== "" &&
    calendarEndDate.getResponseText().trim() !== "")
    getCalendarEvents(startDate, endDate);
  else {
    var htmlOutput = HtmlService
      .createHtmlOutput("É obrigatório informar os dois períodos (início e fim).")
      .setWidth(350)
      .setHeight(250);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "AVISO!");
  }
}

// This function is triggered by the Google Trigger, so we need to look the specified day difference (parameter).
function getCalendarEventsTrigger() {
  var date = new Date();
  date.setDate(date.getDate() - parameters.DIFF_DAYS);
  Logger.log("GOOGLE_SHEET_PARAMETERS: " + GOOGLE_SHEET_PARAMETERS)
  Logger.log("Using DIFF_DAYS as: " + parameters.DIFF_DAYS);

  //YEAR/MONTH/DAY
  var calendarStartDate = date.getFullYear() + "/" + MONTH[date.getMonth()] + "/" + date.getDate() + " 00:00:00 UTC";
  var calendarEndDate = date.getFullYear() + "/" + MONTH[date.getMonth()] + "/" + date.getDate() + " 23:59:59 UTC";
  getCalendarEvents(calendarStartDate, calendarEndDate);

}

function getCalendarEvents(calendarStartDate, calendarEndDate) {
  Logger.log("Considering the following start date: " + calendarStartDate);
  Logger.log("Considering the following end date..: " + calendarEndDate);

  var cal = CalendarApp.getCalendarById(parameters.GOOGLE_CALENDAR_ID);
  var events = cal.getEvents(new Date(calendarStartDate), new Date(calendarEndDate));
  var sheet = SpreadsheetApp.getActive().getSheetByName(parameters.GOOGLE_SHEET_MAIN);
  var allPeople = getAllPeople();
  for (let i = 0; i < events.length; i++) {
    var index = getPeopleIndex(allPeople, events[i].getTitle())
    if (index >= 0) {
      var data = [
        events[i].getTitle(),
        events[i].getStartTime(),
        events[i].getEndTime(),
        allPeople[index].value
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
  lookupPerson = getAllPeople().find(i => i.name === peopleName);
  Logger.log("Selected people: " + peopleName);
  var fullRange = sheet.getDataRange().getValues();

  var totalFormattedDays = "";
  var totalNumberDays = 0;
  var totalValue = 0;

  for (let i = 0; i < fullRange.length; i++) {

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
    peoplePersonalInfo1: lookupPerson.peoplePersonalInfo1,
    peoplePersonalInfo2: lookupPerson.peoplePersonalInfo2,
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
  for (let i = 1; i < range.length; i++) {
    if (range[i][INDEX_COLUMN_NAME].toString().trim() !== "") {
      allPeople.push({
        name: range[i][INDEX_COLUMN_NAME].toString().trim(),
        value: range[i][1],
        peoplePersonalInfo1: range[i][3].toString().trim(),
        peoplePersonalInfo2: range[i][4].toString().trim(),
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
  body.replaceText("{{people_personal_info_1}}", peopleObject.peoplePersonalInfo1)
  body.replaceText("{{people_personal_info_2}}", peopleObject.peoplePersonalInfo2)
  body.replaceText("{{total_days}}", totalDays)

  var totalFormmatedDaysNoHtml = totalFormattedDays.replace(/<br\/>/gm, ',')
  body.replaceText("{{total_formatted_days}}", totalFormmatedDaysNoHtml.substring(0, totalFormmatedDaysNoHtml.length - 1))
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
