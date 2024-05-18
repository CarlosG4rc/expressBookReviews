const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let filtered_users = users.filter((user) => {
    return user.username === username
  });
  if (filtered_users.length > 0){
    return false;
  } else {
    return true;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


///////// endpoints starts
regd_users.get("/books", (req,res) => {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
regd_users.get('/books/isbn/:isbn', async function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
});

regd_users.get('/books/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  var result = Object.keys(books).map(function(key){
    return books[key];
  });
  let filtered_books = result.filter((book) => book.author === author);
  res.send(JSON.stringify(filtered_books));
});

regd_users.get('/books/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  var result = Object.keys(books).map(function(key){
    return books[key];
  });
  let filtered_books = result.filter((book) => book.title === title);
  res.send(JSON.stringify(filtered_books));
});
/////////endpoints ends


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(400).json({message: "Invalid username or password"});
  }

  if (authenticatedUser(username,password)){
    let token = jwt.sign({date: password}, "access");
    req.session.authorization = {
      "token":token,"username" : username
    };
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(208).json({message: "Invalid Login, check username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(books[isbn]){
    books[isbn].reviews[req.session.authorization.username] = review;
    res.status(200).json({message: "Review added successfully"});
  } else {
    res.status(400).json({message: "Book not found"});
  }

  return res.status(300).json(JSON.stringify(books));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  if(books[isbn]){
    books[isbn].reviews[req.session.authorization.username] = '';
    res.status(200).json({message: "Review deleted successfully"});
  } else {
    res.status(400).json({message: "Book not found"});
  }

  return res.status(300).json(JSON.stringify(books));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
