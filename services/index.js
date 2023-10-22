const axios = require("axios");
const Web3 = require("web3");
const { NFT_ABI, HERVEST_ABI } = require("../utils");

// const rpc =
//   "wss://matic.getblock.io/237e138a-d8d9-479f-b9f0-5bc52ae24509/mainnet/";
const rpc = process.env.RPC;

const NFT_1_ADDRESS = process.env.NFT_1_ADDRESS;
const NFT_2_ADDRESS = process.env.NFT_2_ADDRESS;
const HERVEST_ADDRESS = process.env.HERVEST_ADDRESS;

exports.checkOwner = async (id, address, nftAddress) => {
  const web3 = new Web3(Web3.givenProvider || rpc);
  const nftContract = new web3.eth.Contract(NFT_ABI, nftAddress);
  const owner = await nftContract.methods.ownerOf(id).call();

  return owner === address;

  // return true;
};

exports.fetchNFTs = async (address) => {
  // get the contact
  const web3 = new Web3(Web3.givenProvider || rpc);
  const nftContract = new web3.eth.Contract(NFT_ABI, NFT_1_ADDRESS);
  let nft_id = [];
  let prev_id = []; //
  // get the nfts of this address
  const balance = await nftContract.methods.ownerOf(4173).call();
  console.log("balance", balance);
  if (address === balance) {
    console.log("true");
  }
};

exports.updateUserRewardInChain = async (address, reward) => {
  if (!address || !reward) return false;
  try {
    const web3 = new Web3(Web3.givenProvider || rpc);
    const hervest = new web3.eth.Contract(HERVEST_ABI, HERVEST_ADDRESS);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", Number(gasPrice) * 1.1);

    const data = hervest.methods
      .addPoints(address, Web3.utils.toWei(reward.toString(), "ether"))
      .encodeABI();
    const nonce = await web3.eth.getTransactionCount(address);
    console.log("nonce", nonce);
    const tx = {
      from: address,
      to: HERVEST_ADDRESS,
      data,
      gasPrice,
      gas: 4000000,
    };
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    // console.log("receipt", receipt);
    console.log("receipt", receipt.status);
    if (receipt.status === true) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getNftData = async (nftID, nftAddress) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "dd6e3c26c1a24f09a9a174c1937a9326",
    },
  };

  try {
    const api_url = `https://api.opensea.io/v2/chain/matic/contract/${nftAddress}/nfts/${nftID}`;
    const { data } = await axios.get(api_url, options);

    const rarity = data.nft.rarity.rank;
    const image_url = data.nft.image_url;

    return { rarity, image_url };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
