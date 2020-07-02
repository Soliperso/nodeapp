const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String, 
  image: String, 
  description: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);