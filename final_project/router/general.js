const express = require('express');
const axios = require('axios'); // Add axios for HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        // Simulate async operation to get books
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("Books not found");
                }
            });
        };
        
        const bookList = await getBooks();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error });
    }
});

// Task 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Using Promise
    const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            // Simulate async operation
            setTimeout(() => {
                if (isbn <= 10 && isbn > 0 && books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("ISBN for the book not found.");
                }
            }, 100);
        });
    };
    
    getBookByISBN(isbn)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).send(error));
});

// Alternative Task 11 using async/await with Axios (if you want to fetch from external API)
public_users.get('/isbn-async/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        
        // If you had an external API, you would use axios like this:
        // const response = await axios.get(`http://your-api.com/books/${isbn}`);
        
        // For local data, using Promise
        const getBookByISBNAsync = () => {
            return new Promise((resolve, reject) => {
                if (isbn <= 10 && isbn > 0 && books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("ISBN for the book not found.");
                }
            });
        };
        
        const book = await getBookByISBNAsync();
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).send(error);
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        
        // Using Promise to find books by author
        const getBooksByAuthor = (authorName) => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                const booksByAuthor = [];
                
                for (let i = 0; i < bookKeys.length; i++) {
                    if (books[bookKeys[i]].author === authorName) {
                        booksByAuthor.push(books[bookKeys[i]]);
                    }
                }
                
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("The author is not found");
                }
            });
        };
        
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).send(error);
    }
});

// Task 13: Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    // Using Promise
    const getBookByTitle = (bookTitle) => {
        return new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let foundBook = null;
            
            for (let i = 0; i < bookKeys.length; i++) {
                if (books[bookKeys[i]].title === bookTitle) {
                    foundBook = books[bookKeys[i]];
                    break;
                }
            }
            
            if (foundBook) {
                resolve(foundBook);
            } else {
                reject("Book title is not found");
            }
        });
    };
    
    getBookByTitle(title)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).send(error));
});

// Alternative Task 13 using async/await
public_users.get('/title-async/:title', async function (req, res) {
    try {
        const title = req.params.title;
        
        const getBookByTitleAsync = () => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                let foundBook = null;
                
                for (let i = 0; i < bookKeys.length; i++) {
                    if (books[bookKeys[i]].title === title) {
                        foundBook = books[bookKeys[i]];
                        break;
                    }
                }
                
                if (foundBook) {
                    resolve(foundBook);
                } else {
                    reject("Book title is not found");
                }
            });
        };
        
        const book = await getBookByTitleAsync();
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).send(error);
    }
});

// Get book review (keeping original synchronous version)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (isbn <= 10 && isbn > 0) {
        // Using Promise for consistency
        const getReviews = () => {
            return new Promise((resolve, reject) => {
                if (books[isbn] && books[isbn].reviews) {
                    resolve(books[isbn].reviews);
                } else {
                    reject("Review for the book not found.");
                }
            });
        };
        
        getReviews()
            .then(reviews => res.status(200).json(reviews))
            .catch(error => res.status(404).send(error));
    } else {
        return res.status(404).send("Review for the book not found.");
    }
});

// Bonus: Get all books using Promise (alternative to Task 10)
public_users.get('/books-promise', function (req, res) {
    const getAllBooks = () => {
        return new Promise((resolve, reject) => {
            if (books && Object.keys(books).length > 0) {
                resolve(books);
            } else {
                reject("No books available");
            }
        });
    };
    
    getAllBooks()
        .then(bookList => res.status(200).json(bookList))
        .catch(error => res.status(404).send(error));
});

module.exports.general = public_users;