const PDFParser = require("pdf2json");

async function extractPDFText(path) {

   return new Promise((resolve, reject) => {

      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", errData => {

         reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", pdfData => {

         let text = "";

         pdfData.Pages.forEach(page => {

            page.Texts.forEach(textItem => {

               textItem.R.forEach(run => {

                  text += decodeURIComponent(run.T) + " ";
               });
            });
         });

         resolve(text);
      });

      pdfParser.loadPDF(path);
   });
}

module.exports = extractPDFText;