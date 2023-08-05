// create a book prototype


// when I click on "add book":
// 1. create a new object with a unique data-attrbute (date-time?)
// 2. check if the book already exists
// 3. save it to localStorage
// values: title, author, review, read: true/false, reading: true/false, to be read: true/false, data: day-time


// add the book to the main content (sort by title name) and if "reading == true" add to the side container. I can also use Object.hasOwn()


// when you click on the remove button on the card, the book obj is deleted from local storage

// when you click on the read/reading/to-be-read button you can change state and update content
// if the state was "reading" remove it from the side container
// the same rule apply on the side container books

// set "reading goal" section to work properly

let books = JSON.parse(localStorage.getItem("books")) || [];;
const addBookBtn = document.getElementById('addBook');
const sidePeek = document.getElementById('sidePeek');
const sidePeekContent = document.getElementById('sidePeekContent');
const removeBtn = document.getElementById('removeBtn');
const closeBtn = document.getElementById('closeBtn');
const expandBtns = document.querySelectorAll('.expand-btn');
let bookContainer = document.querySelector(".books-container");
let sidePeekIsOpen = false;

addBookBtn.onclick = () => addNewBook();
closeBtn.onclick = () => closePeek();

// Attach event listener to dynamically added expand buttons using event delegation
bookContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('expand-btn')) {
        openPeek(event.target);
    }
});

sidePeek.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-trash')) {
        removeBook(event.target);
    }
});


function Book (title, author, isRead, review, id) {
    this.title = title
    this.author = author
    this.isRead = isRead
    this.review = review
    this.id = id
}

function addNewBook() {
    let title = prompt('title:')
    let author = prompt('author:')
    let review = prompt('Your review:')
    let isRead = prompt('isRead?')

    let book = new Book(title, author, isRead, review, new Date().getTime());

    if (localStorage.getItem("books") !== null) {
        books = JSON.parse(localStorage.getItem("books"));
    }

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
    render()

}

// Load existing books from localStorage or initialize an empty array
// books = JSON.parse(localStorage.getItem("books")) || [];

// Function to create a new book card HTML
function createBookCard(book) {
    return `
        <div class="info-container">
            <div class="info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <div class="tag">Read</div>
            </div>
            <i id="${book.id}" class="expand-btn fa-solid fa-up-right-and-down-left-from-center"></i>
            <p class="text">${book.review}</p>
            <p class="date">December 23, 2022</p>
        </div>
        
    `;
}

function createSidePeekContent(book) {
    return `
        <div class="sidepeek-container">
        <i id="${book.id}" class="fa-solid fa-trash"></i>
            <div class="info-container">
                <div class="info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="tag">Read</div>
                </div>
            </div>
            <p class="full-text">${book.review}</p>
            <p class="date">December 23, 2022</p>
        </div>
    `;
}

function openPeek(target) {
    books = JSON.parse(localStorage.getItem("books")) || [];
    let currentBookId = parseInt(target.id)
    let currentIndex = search(currentBookId)
    let currentBook = books[currentIndex]
    sidePeekContent.innerHTML = createSidePeekContent(currentBook)
    sidePeek.style.width = "50%";
    sidePeek.style.right = "0";
    sidePeekIsOpen = true;
}

function closePeek() {
    sidePeek.style.width = "0";
    sidePeek.style.right = "-20%";
    sidePeekIsOpen = false;
}


function search(id) {
    let i = 0;
    var length = books.length;
    for (i = 0; i < length; i++) {
        if (books[i].id === id) {
            return i
        }
    }   
}


function removeBook(book) {
    // find an object in an array with a unique id
    // Load existing books from localStorage or initialize an empty array
    books = JSON.parse(localStorage.getItem("books")) || [];
    if (sidePeekIsOpen) {
        let index = search(parseInt(book.id))
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books)); // Update localStorage
        render()
        console.log('removed: ' + index);
        closePeek()
        return
    }
    else alert('book not found')
}


// renders books array objects on screen
function render() {
    bookContainer.innerHTML = ""
    let i = 0;
    var length = books.length;
    if (length > 0) {
        for (i = 0; i < length; i++) {
            const newCard = document.createElement('div');
            newCard.classList.add('book')
            newCard.innerHTML = createBookCard(books[i]);
            bookContainer.prepend(newCard);
        }
    }
    else {
        bookContainer.innerHTML = ""
    }
}


render()

