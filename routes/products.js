const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware/middleware");
const { checkUserProduct } = require("../middleware/middleware");

//INDEX - show all products
router.get("/products", (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.render("products/index", { products });
    }
  });
});

//CREATE - add new product to DB
router.post("/products", isLoggedIn, (req, res) => {
  const author = { 
    id: req.user._id, 
    username: req.user.username
  }
  const { name, image, description } = req.body;
  const newProduct = { name, image, description, author };

  Product.create(newProduct, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/products");
    }
  });
});

//NEW - show form to create new product
router.get("/products/new", isLoggedIn, (req, res) => {
  res.render("products/new");
});

// SHOW - shows more info about one product
router.get("/products/:id", (req, res) => {
  Product.findById(req.params.id)
    .populate("comments")
    .exec((err, product) => {
      if (err) {
        console.log(err);
      } else {
        res.render("products/show", { product });
      }
    });
});

// EDIT - shows edit form for a product
router.get("/products/:id/edit", checkUserProduct, (req, res) => {
    Product.findById(req.params.id, (err, product) => {
      res.render('products/edit', { product })
    });
});

// PUT - updates product in the database
router.put("/products/:id", checkUserProduct, (req, res) => {
  const { name, image, description } = req.body;
  const productToUpdate = { name, image, description };

  Product.findByIdAndUpdate(req.params.id, productToUpdate, (err, product) => {
    if (err) {
      res.redirect("/products");
    } else {
      res.redirect("/products/" + product._id);
    }
  });
});

// DELETE - removes product from the database
router.delete("/products/:id", checkUserProduct, (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.redirect("/products");
    } else {
      res.redirect("/products");
    }
  });
});


module.exports = router;
