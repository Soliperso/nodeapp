const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware/middleware");

router.get("/products/:id/comments/new", isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { product });
    }
  });
});

router.post("/products/:id/comments", isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
      res.redirect("/products");
    } else {
      const { text, author } = req.body;
      const newComment = { text, author };

      Comment.create(newComment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          console.log(product);
          product.comments.push(comment);
          product.save();
          res.redirect("/products/" + product._id);
        }
      });
    }
  });
});

module.exports = router;
