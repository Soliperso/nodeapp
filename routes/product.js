const express = require("express");
const router = express.Router(); 
const Product = require('../models/product')

router.get("/products", (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err)
    } else {
      res.render('products/index', { products })
    }
  })
});

router.get("/products/:id", (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err) 
    } else {
      res.render('products/show', { product })
    }
  })
});


module.exports = router;