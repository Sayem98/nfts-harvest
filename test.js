// Example asset data with rarity ranks
const assets = [
  { name: "NFT1", rarityRank: 3 },
  { name: "NFT2", rarityRank: 1 },
  { name: "NFT3", rarityRank: 2 },
  { name: "NFT3", rarityRank: 4 },
  { name: "NFT3", rarityRank: 7 },
  { name: "NFT3", rarityRank: 5 },
  { name: "NFT3", rarityRank: 9 },
  { name: "NFT3", rarityRank: 10 },
  { name: "NFT3", rarityRank: 11 },
  { name: "NFT3", rarityRank: 6 },
  { name: "NFT3", rarityRank: 12 },
  { name: "NFT3", rarityRank: 20 },
  { name: "NFT3", rarityRank: 14 },
  { name: "NFT3", rarityRank: 9 },
];

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

const weights = [3, 2, 17, 4, 15, 7, 10, 1, 12];
const randomIndex = weightedRandomNumber(weights);
console.log("Randomly selected index:", randomIndex);

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
