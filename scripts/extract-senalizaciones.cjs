const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

(async () => {
  const filePath = path.join(__dirname, '..', 'pdfs', 'Portafolios sen\u0303alizaciones .pdf');
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  console.log('=== PAGE COUNT: ' + result.total + ' ===');
  console.log(result.text);
})();
