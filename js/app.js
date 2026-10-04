// ---------- Data ----------
// The array that stores all books in the catalogue.
const books = [
    { title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "IT", copies: 4 },
    { title: "Clean Code", author: "Robert C. Martin", category: "IT", copies: 2 },
    { title: "Principles of Management", author: "Peter Drucker", category: "Business", copies: 3 },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", copies: 1 },
    { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 5 },
    { title: "The Selfish Gene", author: "Richard Dawkins", category: "Science", copies: 0 },
    { title: "Things Fall Apart", author: "Chinua Achebe", category: "Arts", copies: 6 }
];

// ---------- DOM elements ----------
const bookList = document.getElementById("book-list");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const addBookForm = document.getElementById("add-book-form");
const formMessage = document.getElementById("form-message");

// ---------- Functions ----------

// Creates one book card element from a book object.
// "index" is the book's position in the books array (used by the Borrow button).
function createBookCard(book, index) {
    const card = document.createElement("article");
    card.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = "Author: " + book.author;

    const category = document.createElement("p");
    category.textContent = "Category: " + book.category;

    const copies = document.createElement("p");
    if (book.copies === 0) {
        copies.textContent = "Out of stock";
        copies.className = "out-of-stock";
    } else {
        copies.textContent = "Copies available: " + book.copies;
    }

    const borrowButton = document.createElement("button");
    borrowButton.type = "button";
    borrowButton.className = "btn borrow-btn";
    borrowButton.textContent = "Borrow";
    borrowButton.dataset.index = index;
    borrowButton.disabled = book.copies === 0;

    card.append(title, author, category, copies, borrowButton);
    return card;
}

// Shows only the books that match the search text AND the selected category.
// Called at the start and every time the user types, filters, adds or borrows.
function renderBooks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    bookList.innerHTML = "";
    let visibleCount = 0;

    books.forEach(function (book, index) {
        const matchesSearch = book.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            bookList.appendChild(createBookCard(book, index));
            visibleCount++;
        }
    });

    // Show the "No books found." message only when nothing matches.
    noResults.hidden = visibleCount > 0;
}

// Shows a message under the form. type is "error" or "success".
function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "message " + type;
}

// Clears the message under the form (called when the user starts typing again).
function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "message";
}

// Validates the Add Book form and adds the new book to the array.
function handleAddBook(event) {
    event.preventDefault(); // stop the page from reloading

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value;
    const copiesText = document.getElementById("copies").value.trim();

    // Check that every field has been completed.
    if (title === "" || author === "" || category === "" || copiesText === "") {
        showFormMessage("Please fill in all fields.", "error");
        return;
    }

    // Check that copies is a whole number that is 0 or greater.
    const copies = Number(copiesText);
    if (!Number.isInteger(copies) || copies < 0) {
        showFormMessage("Copies must be a whole number of 0 or more.", "error");
        return;
    }

    // Check that the same title and author is not already in the catalogue.
    const isDuplicate = books.some(function (book) {
        return book.title.toLowerCase() === title.toLowerCase() &&
               book.author.toLowerCase() === author.toLowerCase();
    });
    if (isDuplicate) {
        showFormMessage("This book is already in the catalogue.", "error");
        return;
    }

    books.push({ title: title, author: author, category: category, copies: copies });

    // Clear the search and filter so the new book is always visible.
    searchInput.value = "";
    categoryFilter.value = "All";
    renderBooks();
    addBookForm.reset();
    showFormMessage("Book added successfully!", "success");
}

// Reduces the copies of a book by 1 when its Borrow button is clicked.
function handleBorrowClick(event) {
    const button = event.target.closest(".borrow-btn");
    if (!button) {
        return; // the click was not on a Borrow button
    }

    const book = books[Number(button.dataset.index)];
    if (book.copies > 0) { // prevents negative copies
        book.copies--;
        renderBooks();
    }
}

// ---------- Event listeners ----------
searchInput.addEventListener("input", renderBooks);
categoryFilter.addEventListener("change", renderBooks);
addBookForm.addEventListener("submit", handleAddBook);
addBookForm.addEventListener("input", clearFormMessage);
addBookForm.addEventListener("change", clearFormMessage);
bookList.addEventListener("click", handleBorrowClick);

// Show the books when the page first loads.
renderBooks();
