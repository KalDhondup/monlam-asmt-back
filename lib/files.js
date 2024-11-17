const fs = require('fs');

function handleUploadedFile({ filepath }) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, text) => {
      if (err) {
        console.error('Error reading file:', err);
        reject(err);
      }

      resolve({ text })
    })
  })
}



module.exports = {
  handleUploadedFile,
  
}