$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});


// global decl of book to be edited
let editID = 0;
let editMode = false;


function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.delete-button', handleDelete)
  $('#bookShelf').on('click', '.mark-button', handleMark)
  $('#bookShelf').on('click', '.edit-button', handleEdit)
  $('#cancel-button-zone').on('click', '.cancel-button', handleCancel)
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}


//---------------------------------- POST-------------------//
// adds a book to the database
function addBook(bookToAdd) {


if (!editMode) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
} else if (editMode) {
////////////////////////////EDITOR IF EDIT MODE ENABLED //////////////////////////////
  $.ajax({
    method: 'PUT',
    url: `/books/${editID}`,
    data: {
      editMode: true,
      editAuthor: $('#author').val(),
      editTitle : $('#title').val(),
    }
  }).then(response => {
    console.log('editing: ', editID);
    refreshBooks();
    
  }).catch(err => {
    console.log('error in handlemark', err);
    alert('There was an error marking this book as read');
  })




}
 



}

//----------------------------GET--------------------//
// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let read = '';
    
    if (book.isRead) {
      read = '✔'
    }


    
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${read} <td>
        <td> 
          <button class="delete-button" data-id="${book.id}">Delete</button> 
          <button class="mark-button" data-id="${book.id}">Mark as Read</button>
        </td>
        <td>  <button class="edit-button" data-id="${book.id}"> Edit </button> </td>
        
      </tr>
    `);
  }
}

// ------------------------   Delete --------------------------- //
function handleDelete() {
  console.log('Clicked Delete');
  deleteBook($(this).data("id"));
}

/** This function performs an ajax call to the server, including a url with the book ID to be deleted
 * @param  {} bookID
 */
function deleteBook(bookID) {
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookID}`
  }).then(response => {
    console.log('Deleting book: ', bookID);
    refreshBooks();
  }).catch(err => {
    alert("error deleting")
  })
}

// ------------------------   PUT --------------------------- //
function handleMark() {
  console.log('clicked mark');
  markBook( $(this).data("id") );
}

function markBook(bookID) {
  console.log('Marking book');
  
  $.ajax({
    method: 'PUT',
    url: `/books/${bookID}`,
    data: {
      isRead: true
    }
  }).then(response => {
    console.log('Marking Book: ', bookID, ' as read');
    refreshBooks();
    
  }).catch(err => {
    console.log('error in handlemark', err);
    alert('There was an error marking this book as read');
  })
}


//--------------- EDIT ---------------------- //
function handleEdit() {
  console.log('clicked edit');
  editID = $(this).data("id");
  console.log('edit ID: ', editID);
  editMode = true;
  console.log('edit mode activated');
  $('#cancel-button-zone').append(`
  <button class="cancel-button">Cancel</button>
  `)
  
}

function handleCancel() {
  console.log('clicked cancel');
  $('#cancel-button-zone').empty();
}