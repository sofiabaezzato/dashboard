const addBookBtn = document.getElementById('addBook');
const sidePeek = document.getElementById('sidePeek');
const sidePeekContent = document.getElementById('sidePeekContent');
const removeBtn = document.getElementById('removeBtn');
const closeBtn = document.getElementById('closeBtn');
const expandBtns = document.querySelectorAll('.expand-btn');
let bookContainer = document.querySelector(".books-container");
const body = document.querySelector("body")

// add book overlay
let overlay = document.getElementById("overlay");
let backBtn = document.getElementById("backBtn");
let submitBtn = document.getElementById("submitBtn");

let sidePeekIsOpen = false;
let overlayIsOpen = false;



// Load existing books from localStorage or initialize with default books
let books = JSON.parse(localStorage.getItem("books"));
if (!books) {
    initializeDefaultBooks();
    books = JSON.parse(localStorage.getItem("books"));
}

addBookBtn.onclick = () => openOverlay();
closeBtn.onclick = () => closePeek();

backBtn.addEventListener('click', (event) => {
    event.preventDefault()
    closeOverlay()
})

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('submit-button')) {
        event.preventDefault()
        const form = document.querySelector(".book-form")
        const data = Object.fromEntries(new FormData(form).entries())
        if (isDuplicate(data.title)) {
            showMessage()
            return
        }
        else {
            addNewBook(data)
            closeOverlay()
        }
    }
});

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

document.querySelector(".book-form").addEventListener('keydown', (event) => {
    if (event.target.id === "title") {
        hideMessage()
    }
});

function Book (title, author, status, review, date, id) {
    this.title = title
    this.author = author
    this.status = status
    this.review = review
    this.date = date
    this.id = id
}

function initializeDefaultBooks() {
    const defaultBooks = [
        new Book("Greenlights", "Matthew McConaughey", "Read", "This is a great life book for someone who has fell down many times and always gets back up. Very well written, great story tellin, funny, and inspirational. I've already been able to apply a few of the principles in my real life. For an example I had a job interview yesterday at high quality hotel restaurant. While waiting to meet with the hiring manager, I just got in the mind state of one of the principles in the book, which is “Don't walk in there like I want the role. Walk in there like I own it”. With this frame of my mind I literally got the job on the spot and the hiring manager loved me. He went to set up an estage (don't know how to spell it) where I get onsight training essentially to see if it would be a good fit for us. Anyways that has never happened, usually there like “we will get back to you” or “we have a few more interviews”. This time it was like I already owned the role, nothing else needed to be done. It was already so. So I will now own all the roles in my life! This book is just all about self development and a phrase in the book “keep livin”. One of the best books I've read in a longtime. I highly recommend it.", "2023-08-01", 1691266325275),
        new Book("Shoe dog", "Phil Knight", "Reading", "This book is about an entrepreneur's journey, how one man took on the giants and won. The Dassler brothers, founders of Puma and Adidas, began their business in 1924 and Phil Knight began his in 1963. Over the past 18 years of writing reviews, I don't think I have reviewed more than 3 autobiographies. My experience has been that hardly any avoid being little more than an airbrushed account of an extraordinary genius, with depth of character and business prowess, written by the paragon him or herself. My visceral response to an autobiography is ignore.", "2023-07-11", 1691266325285),
        new Book("Meditations", "Marco Aurelio", "Read", "Meditations is a captivating rendition of Marcus Aurelius' profound insights. With clarity and eloquence, it unveils the timeless wisdom of Stoic philosophy. It is a must-read for anyone seeking inner peace and personal growth. Prepare to be inspired and transformed by this remarkable translation.", "2023-06-11", 1691266325295),
        new Book("Leonardo Del Vecchio", "Tommaso Ebhardt", "To be read", "Il libro offre una prospettiva intima e dettagliata sulla straordinaria storia di Leonardo Del Vecchio, fondatore e presidente di uno dei maggiori colossi nel settore dell'occhialeria, tracciando l'evoluzione di Del Vecchio, dalle sue umili origini fino al raggiungimento del successo internazionale. Non è una glorificazione acritica di Del Vecchio, ma un ritratto equilibrato e realistico di un uomo complesso. L'autore esplora le sue vittorie e le sue sconfitte, i momenti di genio imprenditoriale e le sfide personali che ha dovuto affrontare lungo il cammino. Narrazione coinvolgente e ben strutturata, che spazia dalla sua infanzia difficile fino alla creazione di un impero imprenditoriale. L'autore riesce a far emergere la determinazione, l'ingegno e la visione di Del Vecchio, ma allo stesso tempo lascia spazio alle sfumature e alle imperfezioni del protagonista.", "2023-06-11", 1691266325296)
        
    ];

    localStorage.setItem("books", JSON.stringify(defaultBooks));
}

function addNewBook(data) {
    let title = data.title
    let author = data.author
    let review = data.review
    let status = data.status
    let date = data.date
    
    let book = new Book(title, author, status, review, date, new Date().getTime());

    if (localStorage.getItem("books") !== null) {
        books = JSON.parse(localStorage.getItem("books"));
    }

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
    render()
    renderReadCount()

}

// Function to create a new book card HTML
function createBookCard(book) {
    let tagClass = checkStatus(book.status)
    if (book.status === undefined) {
        book.status = "To be read"
        tagClass = checkStatus(book.status)
    }
    /* let date = book.date.moment().format("MMM Do YY") */
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
                <div class="tag ${tagClass}">${book.status}</div>
            </div>
            <i id="${book.id}" class="expand-btn fa-solid fa-up-right-and-down-left-from-center"></i>
            <p class="text">${book.review}</p>
            <p class="date">${book.date}</p>
        </div>
        
    `;
}

function createSidePeekContent(book) {
    let tagClass = checkStatus(book.status)
    if (book.status === "undefined") {
        book.status = "To be read"
        tagClass = checkStatus(book.status)
    }
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
                    <div class="tag ${tagClass}">${book.status}</div>
                </div>
            </div>
            <p class="full-text">${book.review}</p>
            <p class="date">${book.date}</p>
        </div>
    `;
}

function openPeek(target) {
    body.style.overflow = "hidden"
    // Load existing books from localStorage or initialize an empty array
    books = JSON.parse(localStorage.getItem("books")) || [];

    let currentBookId = parseInt(target.id)
    let currentIndex = search(currentBookId)
    let currentBook = books[currentIndex]
    sidePeekContent.innerHTML = createSidePeekContent(currentBook)
    
    var screenWidth = document.documentElement.clientWidth || window.innerWidth
    if (screenWidth < 660) {
        sidePeek.style.width = "100%";
        sidePeek.style.right = "0";
    }
    else if (screenWidth > 1400) {
        sidePeek.style.width = "30%";
        sidePeek.style.right = "0";
    }
    else {
        sidePeek.style.width = "50%";
        sidePeek.style.right = "0";
    }
    sidePeekIsOpen = true;
}

function closePeek() {
    body.style.overflow = "auto"
    sidePeek.style.width = "0";
    sidePeek.style.right = "-20%";
    sidePeekIsOpen = false;
}

// find an object in an array with a unique id
function search(id) {
    let i = 0;
    var length = books.length;
    for (i = 0; i < length; i++) {
        if (books[i].id === id) {
            return i
        }
    }   
}

// search for an object in the books array with the same title
function isDuplicate(title) {
    let i = 0;
    var length = books.length;
    for (i = 0; i < length; i++) {
        if (books[i].title === title) {
            return true
        }
        else hideMessage()
    }   
}

function removeBook(book) {
    // Load existing books from localStorage or initialize an empty array
    books = JSON.parse(localStorage.getItem("books")) || [];
    let index = search(parseInt(book.id))
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books)); // Update localStorage
    render()
    renderReadCount()
    closePeek()
    return
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
renderReadCount()

document.getElementById('date').value = new Date().toISOString().substring(0, 10)

function openOverlay() {
    overlay.style.display = 'flex'
    body.style.overflow = "hidden"
    overlayIsOpen = true;
    var screenWidth = document.documentElement.clientWidth || window.innerWidth
    if (screenWidth < 660) {
        document.getElementById("addBookContainer").style.height = "100%";
        document.getElementById("addBookContainer").style.width = "100%";
    }
}

function closeOverlay() {
    body.style.overflow = "auto"
    overlayIsOpen = false;
    overlay.style.display = 'none';
}

// check if the book is read, reading or to be read and change tag name and style
function checkStatus(status) {
    if (status === "Read") {
        return('read')
    } else if (status === "Reading") {
        return('reading')
    } else {
        return('to-be-read')
    }
}

function updateReadCount() {
    let count = 0;
    let length = books.length
    for (let i = 0; i < length; i++) {
        if (books[i].status === 'Read') count++
    }
    return count
}

function renderReadCount() {
    let bookCount = updateReadCount()
    let bookGoal = 20;
    let progress = bookCount / bookGoal * 100;

    if (bookCount === 1) {
        document.getElementById("readingGoal").innerHTML = `You've read ${bookCount} book out of ${bookGoal}!`
    }
    else if (bookCount > 10) {
        document.getElementById("readingGoal").innerHTML = `You've already read ${bookCount} books out of ${bookGoal}!`
    }
    else if (bookCount === 0) {
        document.getElementById("readingGoal").innerHTML = `You haven't read a book yet!`
    }
    else {
        document.getElementById("readingGoal").innerHTML = `You've read ${bookCount} books out of ${bookGoal}. Keep going!`
    }
    document.getElementById("progress").innerHTML = `Progress: ${progress}%`
}

function showMessage() {
    document.querySelector(".message").style.display = "flex"
}

function hideMessage() {
    document.querySelector(".message").style.display = "none"
}