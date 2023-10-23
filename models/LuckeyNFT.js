const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LuckyNFTSchema = new Schema(
  {
    nft: {
      type: Schema.Types.ObjectId,
      ref: "NFT",
      required: true,
    },
    nftType: {
      type: String,
      required: true,
    },
    rewardAmount: Number
  },
  {
    timestamps: true,
  }
);

const LuckyNFT = model("LuckyNFT", LuckyNFTSchema);
module.exports = LuckyNFT;
