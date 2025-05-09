const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { OrderProduct } = mongoose;

const Product = new mongoose.Schema(
  {
    ProductName: { type: String },
    Size: { type: String },
    ClothingColor: { type: String },
    Inventory: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);
