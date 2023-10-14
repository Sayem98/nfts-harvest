const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
const cors = require("cors");
const controller = require("./controllers/index");
const { verifyOwnerValidateLevel } = require("./middlewares/index");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// database connection
db()
  .then(() => console.log("DB Connect successfull"))
  .catch((err) => console.log("DB Connect failed!"));

// Create a new user
app.post("/api/users", controller.createUser);
app.post("/api/nfts", controller.createNFT);
app.get("/api/user-data/:address", controller.getUserData);
app.get("/api/nfts/:address", controller.getNFTs);
app.get("/api/nfts-by-type/:address", controller.getNFTsByType);
app.post("/api/claim-reward/:address", controller.claimReward);

app.post(
  "/api/claim-all/:address",
  verifyOwnerValidateLevel,
  controller.claimRewardAll
);

app.post("/api/final-claim/:address", controller.finalClaim);
app.get("/api/lucky-nft/:nftType", controller.getAllLuckyNfts);
app.post("/api/lucky-nft/:nftType", controller.selectLuckyNft);
app.get("/api/lucky-winner", controller.getLuckyWinner);

app.listen(PORT, () => {
  console.log(`App listening in [${process.env.NODE_ENV}] on port ${PORT}!`);
});
