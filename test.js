const dotenv = require("dotenv");
dotenv.config({ path: `.env.development` });

const NFT = require("./models/NFTModel");
const db = require("./config/db");

function weightedRandomNumber(weights) {
  const cumulativeWeights = [1 / weights[0]];

  for (let i = 1; i < weights.length; i++) {
    cumulativeWeights.push(cumulativeWeights[i - 1] + 1 / weights[i]);
  }

  const randWeight = Math.floor(
    Math.random() * (cumulativeWeights[cumulativeWeights.length - 1] + 1)
  );

  const index = cumulativeWeights.findIndex(
    (cumulativeSum) => cumulativeSum > randWeight
  );

  return index;
}

db().then(async () => {
  console.log("DB connection successful!");

  const nfts = await NFT.find();

  // create an array of rarity ranks
  const rarityRanks = nfts.map((nft) => nft.rarity);
  let randomIndex = -1;
  while (randomIndex < 0) {
    randomIndex = weightedRandomNumber(rarityRanks);
  }

  console.log(`Randomly selected index #${randomIndex}:`, nfts[randomIndex]);
});

// function selectNFTWithPriority(assets) {
//   // Calculate weights based on inverse rarity rank (lower rank, higher weight)
//   const weights = assets.map((asset) => 1 / asset.rarityRank);

//   // Calculate the total weight
//   const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

//   // Generate a random value within the total weight
//   const randomValue = Math.random() * totalWeight;

//   // Select an NFT based on weights
//   let cumulativeWeight = 0;
//   for (let i = 0; i < assets.length; i++) {
//     cumulativeWeight += weights[i];
//     if (randomValue <= cumulativeWeight) {
//       return assets[i];
//     }
//   }
// }

// const selectedNFT = selectNFTWithPriority(assets);
// console.log("Selected NFT:", selectedNFT);
