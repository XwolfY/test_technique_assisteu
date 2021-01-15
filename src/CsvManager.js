const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CsvManager use to export parsed datas to a CSV file
class CsvManager {
  constructor(array, path = "document_parsed.csv") {
    this.array = array;
    this.path = path;
    this.csvWriter = createCsvWriter({
      path: this.path,
      header: [
        { id: 'filename', title: 'Dossier' },
        { id: 'vote', title: 'Vote'},
        { id: 'title', title: 'Title'},
        { id: 'protractor', title: 'Rapporteur'},
        { id: 'shadowProtractor', title: 'Shadow Rapporteur'},
        { id: 'responsible', title: 'Responsible'}
      ]
    });

    this.exportData = this.exportData.bind(this);
  }

  exportData() {
    this.csvWriter.writeRecords(this.array)
    .then(() => {
        console.log('Csv created !');
    });
  }
}

module.exports = CsvManager;