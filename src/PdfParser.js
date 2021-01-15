const pdfReader = require("pdfreader");
const CsvManager = require("./CsvManager");

class pdfParser {
  constructor(pdfPath, startPage = 1) {
    this.path = pdfPath
    this.reader = new pdfReader.PdfReader();
    this.rows = {};
    this.page = 0;
    this.startPage = startPage;
    this.parsedDatas = [];
    this.tmpFile = "";

    this.filenameRgxp = new RegExp(/[A-Z0-9]{4}\/[0-9]+\/[0-9]+/);
    this.fileVoteRgxp = new RegExp(/^(F\*)$|^(A\*)$|^(A)$|^(F)$/);

    this.pdfReaderCallback = this.pdfReaderCallback.bind(this);
    this.printRows = this.printRows.bind(this);
    this.EOFCallback = this.EOFCallback.bind(this);
    this.parseItem = this.parseItem.bind(this);

    try {
      this.reader.parseFileItems("document_source.pdf", this.pdfReaderCallback);
    } catch (error) {
      throw error;
    }
  }

  // Function called for each items scrapped from the PDF 
  pdfReaderCallback(err, item) {
    if (item && item.page) {
      this.page++;
      // this.printRows();
      this.rows = {}; // clear rows for next page
    } else if (item && item.text && this.page >= this.startPage) {
      this.parseItem(item)
    } else if (!item)
      this.EOFCallback()
  }

  // Callback called when pdfReader reach end of file
  // Export parsed datas to CSV file
  EOFCallback() {
    new CsvManager(this.parsedDatas, "export.csv").exportData();
    ///this.printRows();
  }

  // Function to parse data extracted from PDF
  parseItem(item) {
    let obj = this.parsedDatas.find((obj) => (obj.filename == this.tmpFile));

    if (this.filenameRgxp.test(item.text) && item.x == 1.625) {
      this.tmpFile = item.text;
      this.parsedDatas.push({
        filename: item.text,
        title: "",
        protractor: "N/A",
        shadowProtractor: "N/A",
        responsible: "N/A",
      });
    } else if (this.fileVoteRgxp.test(item.text) && item.x == 4.938) {
      if (obj) obj.vote = item.text;
    } else if (item.x == 5.875 && item.text !== "Dossier Title + ") {
      if (obj) obj.title += (obj.title.length == 0) ? item.text : ` ${item.text}`;
    } else if (item.x == 30.25 && item.text !== "Rapporteur") {
      if (obj && obj.protractor === "N/A")
        obj.protractor = item.text;
      else if (obj)
        obj.protractor += ` / ${item.text}`;
    } else if (item.x == 37.125 && item.text !== "Shadow Rapporteur") {
      if (obj && obj.shadowProtractor === "N/A")
        obj.shadowProtractor = item.text;
      else if (obj)
        obj.shadowProtractor += ` / ${item.text}`;
    } else if (item.x == 43.938 && item.text !== "Responsible") {
      if (obj) obj.responsible = item.text;
    }
    // accumulate items into rows object, per line
    (this.rows[item.y] = this.rows[item.y] || []).push(item);
  }
  // Print all items row by row
  printRows() {
    Object.keys(this.rows) // => array of y-positions (type: float)
      .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
      .forEach((y) => console.log((this.rows[y] || []).map((obj) => obj.text).join(" ")));
  }
};

module.exports = pdfParser;