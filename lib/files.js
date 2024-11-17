const fs = require('fs');
const { getTextLanguage, cleanText } = require('./texts');

function handleUploadedFile({ filepath }) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        reject(err);
      }
      // Split the content into sentences using a regular expression
      // const sentences = data.split(/(?<=\.)\s+/); // Match period followed by space for sentence separation

      resolve({ data })
    })
  })
}



module.exports = {
  handleUploadedFile,
  
}