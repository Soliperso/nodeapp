const Comment = require("../models/comment");
const Product = require("../models/product");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  },
};
