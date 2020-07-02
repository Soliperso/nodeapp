const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String, 
  image: String, 
  description: String, 
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comment'
    }
  ],
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Product', productSchema);