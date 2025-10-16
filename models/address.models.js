const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
    userId: { type: String, required: true },
    name: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;