const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    Name: { type: String },
    PhoneNumber: { type: Number },
    Email: { type: String },
    Password: { type: String },
    Status: { type: Boolean }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
