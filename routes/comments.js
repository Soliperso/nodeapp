const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware/middleware");
const { checkUserComment } = require("../middleware/middleware");

const product = require("../models/product");

// NEW - render the create a new comment form
router.get("/products/:id/comments/new", isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { product });
    }
  });
});

// CREATE - a new comment
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
          // add user and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();

          product.comments.push(comment);
          product.save();
          res.redirect("/products/" + product._id);
        }
      });
    }
  });
});

// Edit comment
router.get("/products/:id/comments/:comment_id/edit", checkUserComment, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", { product_id: req.params.id, comment });
    }
  });
});

//  Comment update
router.put("/products/:id/comments/:comment_id", checkUserComment, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/products/" + req.params.id);
    }
  });
});

// Delete comment
router.delete("/products/:id/comments/:comment_id", checkUserComment, (req, res) => [
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/products/" + req.params.id);
    }
  }),
]);

module.exports = router;
