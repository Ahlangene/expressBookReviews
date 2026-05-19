const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books[1]),null,4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  if (isbn<=10 && isbn>0){  
  return req.send(books[isbn]);
  }
  return req.send("ISBN for the book not found.");

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  books.forEach(book => {
    if (author==book.author){
        return req.send(JSON.stringify(book));
    }
  });
  return req.send("The author is not found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    books.forEach(book => {
      if (title==book.title){
          return req.send(JSON.stringify(book));
      }
    });
    return req.send("Book title is not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    
    if (isbn<=10 && isbn>0){  
        return req.send(books[isbn].reviews);    
    }
        return req.send("Review for the book not found.");
      
});

module.exports.general = public_users;
