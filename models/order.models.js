const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const orderSchema = new mongoose.Schema(
    {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;