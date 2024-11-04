function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Menu')
      .addItem('Débitos', 'getPeopleDebits')
      .addItem('Recibos', 'getPeopleReceipts')
      .addItem('Reprocessar eventos do calendário', 'getCalendarEventsManual')
      .addToUi();
}
