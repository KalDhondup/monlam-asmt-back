Nodejs Server with SQLite database backend application.

## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result it's running correctly. On initial run, it creates sqlite database file (sqlite.db) at the root directory. Files are stored in files table and sentences are stored in translations table.



```bash

Few Restful Apis:

[post /upload] : to upload text file to database
[get /files] : to get all uploaded raw files
[get //files/:fileId/sentences] : to get all sentences, translations of the provided fileId
[get //sentences/:id] : to get specific sentence and its translation by using id as sententce row id
[post /sentences] : to upload array of all changed translation text to be updated. 
eg: sentences = [
    {id:1, sentence: "original text", translation: "translated text"},
    ...
]
```
