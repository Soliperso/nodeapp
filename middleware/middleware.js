
const Comment = require("../models/comment");
const Product = require("../models/product");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'You need to be logged in!')
    res.redirect("/login");
  },
  checkUserProduct: (req, res, next) => {
    if (req.isAuthenticated()) {
      Product.findById(req.params.id, (err, product) => {
        if (err) {
          res.redirect('back');
        } else {
          if (product.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
  },
  checkUserComment: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          res.redirect('back');
        } else {
          if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'You need to be logged to do that!')
      res.redirect('back');
    }
  },
  }
