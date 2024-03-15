const books = [];
const RENDER_EVENT = "render-book";
const bookStorage = "BOOK_STORAGE";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(bookStorage);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function saveBooks() {
  localStorage.setItem(bookStorage, JSON.stringify(books));
}

function addBook() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = parseInt(document.getElementById("inputBookYear").value);
  const completedBook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generatebookObject(generatedID, titleBook, authorBook, yearBook, completedBook);
  books.push(bookObject);

  saveBooks();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generatebookObject(id, titleBook, authorBook, yearBook, completedBook) {
  return {
    id,
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isCompleted: completedBook,
  };
}

function makeBook(bookObject) {
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");

  const titleBook = document.createElement("h3");
  titleBook.innerText = bookObject.title;

  const authorBook = document.createElement("p");
  authorBook.innerText = `Author: ${bookObject.author}`;

  const yearBook = document.createElement("p");
  yearBook.innerText = `Year: ${bookObject.year}`; 

  textContainer.append(titleBook, authorBook, yearBook);
  container.append(textContainer);

  const buttonContainer = document.createElement("action");
  buttonContainer.classList.add("button-container");

  const editButton = document.createElement("buttonEdit");
  editButton.innerText = bookObject.isCompleted ? "Belum Selesai Dibaca" : "Selesai Dibaca";
  editButton.addEventListener("click", function () {
    const bookId = parseInt(this.parentNode.parentNode.id.split("-")[1]);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      if (bookObject.isCompleted) {
        books[bookIndex].isCompleted = false;
        const incompleteBooksList = document.getElementById("incompleteBookshelfList");
        const completedBooksList = document.getElementById("completeBookshelfList");
        completedBooksList.removeChild(this.parentNode.parentNode);
        incompleteBooksList.appendChild(makeBook(books[bookIndex]));
        saveBooks();
      } else {
        books[bookIndex].isCompleted = true;
        const incompleteBooksList = document.getElementById("incompleteBookshelfList");
        const completedBooksList = document.getElementById("completeBookshelfList");
        incompleteBooksList.removeChild(this.parentNode.parentNode);
        completedBooksList.appendChild(makeBook(books[bookIndex]));
        saveBooks();
      }
    } else {
      console.error("Buku tidak ditemukan:", bookId);
    }
  });

  const deleteButton = document.createElement("buttonDelete");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", function () {
    const bookIndex = books.findIndex((book) => book.id === bookObject.id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooks();
      document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      saveBooks();
      console.error("Book not found for deletion");
    }
  });

  buttonContainer.append(editButton, deleteButton);
  container.append(buttonContainer);

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById("incompleteBookshelfList");
  const completedBooksList = document.getElementById("completeBookshelfList");

  uncompletedBooksList.innerHTML = "";
  completedBooksList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBooksList.append(bookElement);
    else completedBooksList.append(bookElement);
  }
});

// document.getElementById("searchSubmit").addEventListener("click", function (event) {
//   event.preventDefault();

//   const cariBuku = document.getElementById("searchBookTitle").value.toLowerCase();
//   const listBuku = document.querySelectorAll(".book_item");
// let filteredBooks = [];

//   for (const dataBuku of listBuku) {
//     if (dataBuku.innerText.toLowerCase().includes(cariBuku)) {
//       dataBuku.parentElement.parentElement.style.display = "block";
//     } else {
//       dataBuku.parentElement.parentElement.style.display = "none";
//     }
//   }
// });


// Fungsi untuk mencari buku berdasarkan judul

document.getElementById('searchSubmit').addEventListener("click", function (event) {
  event.preventDefault();

  const searchText = document.getElementById('searchBookTitle').value.toLowerCase();

  const bookItems = document.querySelectorAll('.book_item');
  let filteredBooks = [];

  for (const bookItem of bookItems) {
    const bookTitle = bookItem.querySelector('h3')?.textContent.toLowerCase() || '';

    if (bookTitle && bookTitle.includes(searchText)) {
      filteredBooks.push(bookItem); 
    }
  }

  bookItems.forEach(bookItem => {
    bookItem.style.display = filteredBooks.includes(bookItem) ? 'block' : 'none';
  });
});