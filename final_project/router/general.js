const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  return res.status(200).send(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const filteredBook = Object.values(books).filter(
    ({ author }) => author === req.params.author
  );
  return res.status(200).send(filteredBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const filteredBook = Object.values(books).filter(
    ({ title }) => title === req.params.title
  );
  return res.status(200).send(filteredBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).send(books[req.params.isbn]["reviews"]);
});

async function getBooksList() {
  return axios.get("http://localhost:5000/").then((res) => res.data);
}

async function getBookDetails(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`).then((res) => res.data);
}

async function getBookDetailsBasedOnAuthor(author) {
  return axios.get(`http://localhost:5000/author/${author}`).then((res) => res.data);
}

async function getBookDetailsBasedOnTitle(title) {
  return axios.get(`http://localhost:5000/title/${title}`).then((res) => res.data);
}

module.exports.general = public_users;
