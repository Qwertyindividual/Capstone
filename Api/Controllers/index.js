// Controller //

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const route = express.Router();
const {User, Product, Cart} = require('../Model');


// User Instance

const user = new User();

// Product Instance

const product = new Product();

//Cart Instance

const cart = new Cart();


// GET Used Goods

route.get("^/$|/Artcade", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../View/index.html"));
});

// ----------- USER LOGIN ---------- //

// To login

route.post("/login", bodyParser.json(), (req, res) => {
  user.login(req, res);
});

// To retrieve all users

route.get("/user", (req, res) => {
  user.fetchUsers(req, res);
});

// To retrieve a single user

route.get("/user/:id", (req, res) => {
  user.fetchUser(req, res);
});

// To update

route.put("/user/:id", bodyParser.json(), (req, res) => {
  user.updateUser(req, res);
});

// To register

route.post("/register", bodyParser.json(), (req, res) => {
  user.createUser(req, res);
});

// To delete

route.delete("/user/:id", (req, res) => {
  user.deleteUser(req, res);
});

// ---------- PRODUCTS ---------- //

// To fetch all products

route.get("/item", (req, res) => {
  product.fetchProducts(req, res);
});

// To fetch a single product

route.get("/item/:id", (req, res) => {
  product.fetchProduct(req, res);
});

// To add a new product

route.post("/item", bodyParser.json(), (req, res) => {
  product.addProduct(req, res);
});

// To update a product

route.put("/item/:id", bodyParser.json(), (req, res) => {
  product.updateProduct(req, res);
});

// To delete a product

route.delete("/item/:id", (req, res) => {
  product.deleteProduct(req, res);
});

// ---------- CART ---------- //

//To get the cart information

route.get("/user/:id/carts", bodyParser.json(), (req, res) => {
  cart.fetchCart(req, res)
})

//To add to the cart

route.post("/user/:id/cart", (req, res) => {
  cart.addCart(req, res)
})

//Update cart information

route.put("/user/:id/cart/:id", bodyParser.json(), (req, res) => {
  cart.updateCart(req, res);
});


//To delete items in the cart

route.delete("/user/:id/cart", (req, res) => {
  cart.deleteCart(req, res)
})


module.exports = route;
