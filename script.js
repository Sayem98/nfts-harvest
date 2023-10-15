const NFT = require("./models/LuckeyNFT");
const { getNftData } = require("./services/index.js");

async function update() {
  const nfts = await NFT.find();

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];

    const { rarity } = await getNftData(nft.nftID, nft.nftAddress);
    nft.rarity = rarity;

    await nft.save();
  }
}

update().then(() => {
  console.log("Done");
});
