const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);
module.exports = Admin;
