const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const NFT = require("../models/NFTModel");
const { getNftData } = require("../services");
const db = require("../config/db");

async function seed() {
  const nfts = await NFT.find();

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];

    const { rarity, image_url } = await getNftData(nft?.nftID, nft.nftAddress);
    nft.rarity = rarity;
    nft.imageUrl = image_url;

    await nft.save();
    console.log(`#${i + 1} NFT updated!`);
  }

  console.log("Seeding completed!");

  // Exit the process
  process.exit(0);
}

db().then(() => {
  console.log("DB connection successful!");
  console.log(`---Seeding to ${process.env.NODE_ENV} database---`);
  seed();
});
