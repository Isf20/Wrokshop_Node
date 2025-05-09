const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const { OrderItem } = mongoose;

const Order = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    Quantity: { type: Number },
    PriceOrder: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
