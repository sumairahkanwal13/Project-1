const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: [String], 
    },
    color: {
      type: String,
    },
    image: {
      type: String, 
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0
},
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Products = mongoose.model("Products", productSchema);

module.exports = Products;