
const Comment = require("../models/comment");
const Product = require("../models/product");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },
  checkUserProduct: (req, res, next) => {
    if (req.isAuthenticated()) {
      Product.findById(req.params.id, (err, product) => {
        if (err) {
          res.redirect('back');
        } else {
          if (product.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
  }
  }
