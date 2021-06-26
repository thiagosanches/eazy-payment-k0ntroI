function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Menu')
      .addItem('Debits', 'getPeopleDebits')
      .addItem('Receipts', 'getPeopleReceipts')
      .addToUi();
}
