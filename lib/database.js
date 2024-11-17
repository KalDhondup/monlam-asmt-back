const sqlite3 = require('sqlite3').verbose();
const { handleUploadedFile } = require('./files');
const { getSentencesFromText } = require('./texts');


/*
* creates SQLite database at the root location
*/
function createDB() {
  const dbname = 'sqlite.db';

  return new sqlite3.Database(`./${dbname}`, (err) => {
    if (err) console.error(err.message);
    console.log(`Connected to SQLite database: ${dbname} `);
  });
}

function createTable({ db, sql, }) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err.message);
      resolve(this);
    });
  })
}


/*
* file uploads
*/
function uploadFile({ db, req, res }) {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const { filename, path: filepath } = req.file;

  // Insert file metadata into SQLite
  db.run(
    `INSERT INTO files (filename, filepath) VALUES (?, ?)`,
    [filename, filepath],
    async function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error saving file metadata.');
      }

      const { data } = await handleUploadedFile({ filepath })

      createSentences({ db, fileId: this.lastID, sentences: getSentencesFromText(data) });

      res.send({
        message: 'File uploaded successfully!',
        fileId: this.lastID,
      });
    }
  );
}


function createSentences({ db, fileId, sentences }) {
  const stmt = db.prepare('INSERT INTO translations (file_id,sentence,translation) VALUES (?, ?,?)');
  sentences.forEach(sentence => {
    stmt.run(fileId, sentence, '', (err) => {
      if (err) {
        console.error('Error inserting sentence:', err);
      }
    });
  });
  stmt.finalize();  // Finalize the statement to commit
}

function updateTranslations({ db, req, res }) {
  const updatedTranslations = req.body;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION'); // Start a transaction for better performance

    const stmt = db.prepare(`UPDATE translations SET translation = ? WHERE id = ?`);

    // Loop through updates and execute the prepared statement
    updatedTranslations.forEach(({ id, translation }) => {
      stmt.run(translation, id, (err) => {
        if (err) {
          console.error(`Error updating id ${id}:`, err);
        } else {
          console.log(`Row with id ${id} updated successfully.`);
        }
      });
    });

    stmt.finalize(); // Finalize the statement

    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Transaction commit failed:', err);
        return res.status(500).send({ error: 'Database error' });
      }
      res.send({ message: 'Translations updated successfully' });
    });
  });

}

function getFiles({ req, res, db }) {
  db.all(`SELECT * FROM files`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error retrieving files.');
    }
    res.json(rows);
  });
}

function getFileSentences({ req, res, db }) {

  const { fileId } = req.params;

  db.all(`SELECT id, sentence, translation, file_id FROM translations WHERE file_id = ?`, [fileId], (err, rows) => {
    if (err) {
      console.error('Error fetching sentences:', err);
      return;
    }

    res.json(rows);  // Pass the sentences to the callback
  });
}

function getSentence({ req, res, db }) {
  const { id } = req.params;
  db.all(`SELECT id, sentence, translation FROM translations WHERE id = ?`, [id], (err, data) => {
    if (err) {
      console.error('Error fetching sentences:', err);
      return;
    }

    console.log({ data })
    // Map the rows to just get the sentence text
    // const sentences = rows.map(row => row.sentence);
    res.json(data[0]);  // Pass the sentences to the callback
  });
}


module.exports = {
  createDB,
  createTable,

  uploadFile,


  getFiles,
  getFileSentences,

  createSentences,
  updateTranslations,

  getSentence,
}