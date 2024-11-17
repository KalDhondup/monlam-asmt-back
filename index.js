const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createDB, createTable, uploadFile, getFiles, getFileSentences, getSentence, updateTranslations } = require('./lib/database');
const { CREATE_FILES_TABLE_QUERY, CREATE_TRANSLATIONS_TABLE_QUERY } = require('./lib/sql-queries')

const app = express();
const PORT = 8000;

/*
* using cors to ignore cors errors 
*/
app.use(cors());


/*
* creates database and tables
*/
const db = createDB();
createTable({ db, sql: CREATE_FILES_TABLE_QUERY }).catch((err) => console.error(err));
createTable({ db, sql: CREATE_TRANSLATIONS_TABLE_QUERY }).catch((err) => console.error(err));

/*
*  middleware for parsing JSON and serving static files
*/
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });



/*
* Routes
*/

app.get('/', (req, res) => res.send('Node Server'));


/*
* Uploads File 
* stores the sentences in translation table with fileId ref
*/
app.post('/upload', upload.single('file'), (req, res) => uploadFile({ db, req, res }))

// List Uploaded Files
app.get('/files', (req, res) => getFiles({ db, req, res }))

app.get('/files/:fileId/sentences', (req, res) => getFileSentences({ db, req, res }))


app.get('/sentences/:id', (req, res) => getSentence({ db, req, res }))
app.post('/sentences', (req, res) => updateTranslations({ db, req, res }))


app.listen(PORT, () => {
  console.log(`Node Server running on http://localhost:${PORT}`);
});
