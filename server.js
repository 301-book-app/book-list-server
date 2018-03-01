'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({ extended: true });

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get(`/api/v1/books/:id`, (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.post('/api/v1/books/add', bodyParser, (req, res) => {
  let {title, author, isbn, image_url, description} = req.body;
  client.query(
    `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`,
    [title, author, isbn, image_url, description])
    .then(() => res.sendStatus(201))
    .catch(console.error);
});

app.delete(`/api/v1/books/:id`, (req, res) => {
  client.query(`DELETE FROM books WHERE book_id=${req.params.id};`)
    .then(() => res.sendStatus(204))
    .catch(console.error);
});

app.put(`/api/v1/books/:id`, bodyParser, (req, res) => {
  let {title, author, isbn, image_url, description, book_id} = req.body;
  client.query(
    `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5 WHERE book_id=$6;`,
    [title, author, isbn, image_url, description, book_id])
    .then(() => res.sendStatus(201))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// env variables to set manually when testing locally
// export PORT=3000
// export CLIENT_URL=http://localhost:8080
// Mac: export DATABASE_URL=postgres://localhost:5432/books_app