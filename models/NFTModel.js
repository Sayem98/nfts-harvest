const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NFTSchema = new Schema(
  {
    nftID: {
      type: String,
      required: true,
    },
    nftAddress: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    prevLevel: {
      type: Number,
      default: 1,
    },
    lastClaimed: Date,
    rewardType: Number,
    claimedDays: {
      type: Number,
      default: 0,
    },
    rarity: Number,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const NFT = model("NFT", NFTSchema);
module.exports = NFT;
