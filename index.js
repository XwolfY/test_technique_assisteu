const PdfParser = require("./src/PdfParser");

const main = function () {
  new PdfParser('./document_source.pdf', 2);
}

main();