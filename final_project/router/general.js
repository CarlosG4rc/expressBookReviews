const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  let user = req.body;
  let username = user.username;
  let password = user.password;

  if (username && password){
    if (isValid(username)){
      users.push({"username": username , "password" : password});
      res.status(200).json({message: "User registered successfully"});
    } else {
      res.status(400).json({message: "User already exists"});
    }
  } else {
    res.status(400).json({message: "Invalid username or password"});
  }
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try{
    const response = await axios.get("http://localhost:5000/customer/books");
    res.send(response.data);
  } catch (error){
    res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try{
    const response = await axios.get("http://localhost:5000/customer/books/isbn/" + isbn);
    res.send(response.data);
  } catch (error){
    res.status(500).json({message: "Error fetching book details"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try{
    const response = await axios.get("http://localhost:5000/customer/books/author/" + author);
    res.send(response.data);
  } catch (error){
    res.status(500).json({message: "Error fetching book details"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try{
    const response = await axios.get("http://localhost:5000/customer/books/title/" + title);
    res.send(response.data);
  } catch (error){
    res.status(500).json({message: "Error fetching book details"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
