const { query, response } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status

router.put('/:id', (req, res) => {
const bookID = req.params.id;
console.log('bookid', bookID);

let isRead = req.body.isRead;
console.log(isRead);

let queryText = '';

if (isRead) {
  queryText = `UPDATE "books" SET "isRead"=true WHERE "books".id = $1;`;
} else if (!isRead) {
  return;
} else {
  res.sendStatus(500);
  return;
}

pool.query(queryText, [bookID] )
.then(response => {
  console.log(response.rowCount);
  res.sendStatus(202);
}).catch(err => {
  console.log('error in put', err);
  res.sendStatus(500);
  
})
})

//edit put ----------------------------------------------
router.put('/edit/:id', (req, res) => {
let bookID = req.params.id;
let newAuthor = req.body.editAuthor;
let newTitle = req.body.editTitle;

console.log('editing ', bookID, newAuthor, newTitle);

let queryText = `UPDATE "books" SET "author"='${newAuthor}', "title"='${newTitle}'  WHERE "books".id = $1;`;          


pool.query(queryText, [bookID] )
.then(response => {
  console.log(response.rowCount);
  res.sendStatus(202);
  
}).catch(err => {
  console.log('error in edit put', err);
  res.sendStatus(500);
})
})




// "title"='${newTitle}'




// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id


router.delete('/:id', (req, res) => {
const bookToDelete = req.params.id;
console.log('to delete', bookToDelete);
const queryText = `DELETE FROM "books" WHERE "books".id = $1;`;
pool.query(queryText, [bookToDelete] )
.then( response => {
  console.log('--Deleted book with ID: ', bookToDelete);
  res.sendStatus(200);
  }).catch(err => {
  console.log('Error in routerDelete', err);
  res.sendStatus(500);
})
});

module.exports = router;
