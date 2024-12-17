const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["domestic", "international"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
