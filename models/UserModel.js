const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const createUserSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    reward: {
      type: Number,
      default: 0,
    },
    claimedReward: {
      type: Number,
      default: 0,
    },
    nfts: [
      {
        id: String,
        address: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", createUserSchema);
module.exports = User;
