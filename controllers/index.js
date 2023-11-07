const _ = require("lodash");
const Web3 = require("web3");
const services = require("../services");
const User = require("../models/UserModel");
const NFT = require("../models/NFTModel");
const LuckyNFT = require("../models/LuckeyNFT");
const NFT_1_ADDRESS = process.env.NFT_1_ADDRESS;
const NFT_2_ADDRESS = process.env.NFT_2_ADDRESS;
const { NFT_ABI, HERVEST_ABI } = require("../utils");
const Admin = require("../models/Admin");
const rpc = process.env.RPC;

function weightedRandomNumber(weights) {
  // Calculate the cumulative weights of the reciprocals (smaller weights have higher influence)
  let cumulativeWeights = [1 / weights[0]];
  for (let i = 1; i < weights.length; i++) {
    cumulativeWeights[i] = cumulativeWeights[i - 1] + 1 / weights[i];
  }

  // Generate a random number between 0 and the total of the cumulative weights
  let totalWeight = cumulativeWeights[cumulativeWeights.length - 1];
  let randWeight = Math.random() * totalWeight;

  // Find the index where the cumulative weight is greater than the random weight
  let index = cumulativeWeights.findIndex(
    (cumulativeSum) => randWeight < cumulativeSum
  );

  return index;
}

/*
  explain what this function does
*/
const getMonthsDays = (year, month) => {
  // check leap year
  let x = 0;
  if (year % 400 === 0) {
    x = 29;
  } else if (year % 100 === 0) {
    x = 28;
  } else if (year % 4 === 0) {
    x = 29;
  } else {
    x = 28;
  }
  const monthsDays = {
    1: 31,
    2: x,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };
  return monthsDays[month];
};

exports.getNFTs = async (req, res) => {
  try {
    // get nftID of a user based on address
    const user = await User.findOne({ address: req.params.address });
    if (!user) return res.status(400).send("User not found");

    const nfts = [];
    const nftIds = user.nfts;

    for (let index = 0; index < nftIds?.length; index++) {
      const nftID = nftIds[index].id;
      const nftAddress = nftIds[index].address;
      const nft = await NFT.findOne({ nftID, nftAddress });
      const owner = await services.checkOwner(
        nftID,
        req.params.address,
        nftAddress
      );

      // checing if more that 24 hours has passed after last claimed
      if (nft.lastClaimed) {
        // get utc days, months, years of the both current date and lastClaimed date
        const todaysDay = new Date().getDate();
        const todaysMonth = new Date().getMonth() + 1;
        const todaysYear = new Date().getFullYear();

        const lastClaimedDay = new Date(nft.lastClaimed).getDate();
        const lastClaimedMonth = new Date(nft.lastClaimed).getMonth() + 1;
        const lastClaimedYear = new Date(nft.lastClaimed).getFullYear();

        if (todaysDay > lastClaimedDay && todaysDay - lastClaimedDay > 1) {
          // more 24 hours has passed, reset claimedDays and level
          // console.log("days issue");
          nft.claimedDays = 0;
          if (nft.level == nft.prevLevel) {
            nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
          }
          nft.rewardType =
            nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
          await nft.save();
        } else if (todaysMonth > lastClaimedMonth) {
          // console.log("month issue");
          if (lastClaimedDay > 1) {
            // more 24 hours has passed, reset claimedDays and level
            nft.claimedDays = 0;
            if (nft.level == nft.prevLevel) {
              nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
            }
            nft.rewardType =
              nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
            await nft.save();
          }
        } else if (todaysYear > lastClaimedYear) {
          if (lastClaimedDay > 1) {
            // more 24 hours has passed, reset claimedDays and level
            nft.claimedDays = 0;
            if (nft.level == nft.prevLevel) {
              nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
            }
            nft.rewardType =
              nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
            await nft.save();
          }
        }
      }

      if (owner) {
        nfts.push(nft);
      }
    }

    // separate nfts based on nftAddress

    const nfts1 = nfts.filter((nft) => nft.nftAddress === NFT_1_ADDRESS);
    const nfts2 = nfts.filter((nft) => nft.nftAddress === NFT_2_ADDRESS);

    const result = {
      nfts1,
      nfts2,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getNFTsByType = async (req, res) => {
  try {
    // get nftID of a user based on address
    const user = await User.findOne({ address: req.params.address });
    if (!user) return res.status(400).send("User not found");

    const nfts = [];
    let nftIds = user.nfts;
    const nftType = req.query.nftType;

    if (nftType == 1) {
      nftIds = nftIds.filter((nft) => nft.address === NFT_1_ADDRESS);
    } else if (nftType == 2) {
      nftIds = nftIds.filter((nft) => nft.address === NFT_2_ADDRESS);
    } else {
      return res.status(400).send("Invalid nft type");
    }

    const total = nftIds.length;

    // Search
    const search = req.query.search;
    if (search) {
      const _nft = await NFT.findOne({ nftID: search });
      const _nftIds = nftIds.filter((nft) => nft.id == _nft?.nftID);
      if (_nftIds.length > 0) {
        nftIds = _nftIds;
      }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (endIndex > nftIds.length) {
      endIndex = nftIds.length;
    }

    for (let index = startIndex; index < endIndex; index++) {
      const nftID = nftIds[index].id;
      const nftAddress = nftIds[index].address;

      const nft = await NFT.findOne({ nftID, nftAddress });

      const owner = await services.checkOwner(
        nftID,
        req.params.address,
        nftAddress
      );

      // checing if more that 24 hours has passed after last claimed
      if (nft.lastClaimed) {
        // get utc days, months, years of the both current date and lastClaimed date
        const todaysDay = new Date().getDate();
        const todaysMonth = new Date().getMonth() + 1;
        const todaysYear = new Date().getFullYear();

        const lastClaimedDay = new Date(nft.lastClaimed).getDate();
        const lastClaimedMonth = new Date(nft.lastClaimed).getMonth() + 1;
        const lastClaimedYear = new Date(nft.lastClaimed).getFullYear();

        if (todaysDay > lastClaimedDay && todaysDay - lastClaimedDay > 1) {
          // more 24 hours has passed, reset claimedDays and level
          // console.log("days issue");
          nft.claimedDays = 0;
          if (nft.level == nft.prevLevel) {
            nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
          }
          nft.rewardType =
            nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
          await nft.save();
        } else if (todaysMonth > lastClaimedMonth) {
          //console.log("month issue");
          if (
            todaysDay > 1 ||
            getMonthsDays(lastClaimedYear, lastClaimedMonth) - lastClaimedDay >
              0
          ) {
            //console.log(lastClaimedDay);
            //console.log(todaysDay);
            // more 24 hours has passed, reset claimedDays and level
            nft.claimedDays = 0;
            if (nft.level == nft.prevLevel) {
              nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
            }
            nft.rewardType =
              nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
            await nft.save();
          }
        } else if (todaysYear > lastClaimedYear) {
          if (
            todaysDay > 1 ||
            getMonthsDays(lastClaimedYear, lastClaimedMonth) - lastClaimedDay >
              0
          ) {
            // more 24 hours has passed, reset claimedDays and level
            nft.claimedDays = 0;
            if (nft.level == nft.prevLevel) {
              nft.level = nft.level > 1 ? nft.level - 1 : nft.level;
            }
            nft.rewardType =
              nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
            await nft.save();
          }
        }
      }

      if (owner) {
        nfts.push(nft);
      } else {
        // remove nft from user's nft list
        await User.findByIdAndUpdate(user._id, {
          $pull: { nfts: { id: nftID, address: nftAddress } },
        });
      }
    }

    // remove duplicate nfts
    const uniqueNfts = _.uniqBy(nfts, "nftID");

    res.status(200).json({ nfts: uniqueNfts, total: total });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.createNFT = async (req, res) => {
  try {
    const { nftID, nftAddress, address } = req.body;

    if (nftAddress !== NFT_1_ADDRESS && nftAddress !== NFT_2_ADDRESS) {
      return res.status(400).send("Invalid nft address");
    }
    if (!nftID || !nftAddress)
      return res.status(400).send("Invalid request data");

    const user = await User.findOne({ address });

    // loop
    let nRegister = 0;

    const nftIDs = nftID.split(",");
    for (let i = 0; i < nftIDs.length; i++) {
      try {
        const owner = await services.checkOwner(nftIDs[i], address, nftAddress);
        if (!owner) return res.status(400).send("Invalid owner");
      } catch (err) {
        return res.status(400).send(err.message);
      }

      // check if nft exists in db
      let nft = await NFT.findOne({ nftID: nftIDs[i], nftAddress });

      // if not exists, create nft in db
      if (!nft) {
        // get nft rarity from opensea api
        const { rarity, image_url } = await services.getNftData(
          nftIDs[i],
          nftAddress
        );

        nft = new NFT({
          nftID: nftIDs[i],
          nftAddress,
          rewardType: nftAddress === NFT_1_ADDRESS ? 1 : 0.5,
          lastClaimed: null,
          prevLevel: 1,
          rarity,
          imageUrl: image_url,
        });
      }

      // If nft is already in user's nft list, return error
      const nfts = user?.nfts;
      let alreadyRegistered = false;
      for (let j = 0; j < nfts.length; j++) {
        if (nfts[j].id === nftIDs[i] && nfts[j].address === nftAddress) {
          alreadyRegistered = true;
          break;
        }
      }

      if (!alreadyRegistered) {
        nRegister++;

        // update user in db
        await User.findByIdAndUpdate(user._id, {
          $push: { nfts: { id: nftIDs[i], address: nftAddress } },
        });

        await nft.save();

        // reset nft
        await NFT.findByIdAndUpdate(nft._id, {
          level: 1,
          rewadrType: 1,
          claimedDays: 0,
        });
      }
    }

    res.status(201).json({ nRegister, nUnregister: nftIDs.length - nRegister });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.updateNFT = (req, res) => {};

exports.createUser = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).send("Address is required");

    // check if user exists
    let user = await User.findOne({ address });

    if (user) return res.status(400).send("User already exists");

    // create user in db
    user = await User.create({ address });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserData = async (req, res) => {
  try {
    // get total claimedReward of a user based on address
    const { address } = req.params;
    if (!address) return res.status(400).send("Address is required");

    // check if user exists
    let user = await User.findOne({ address });
    if (!user) {
      user = await User.create({ address });
    }

    // get total claimedReward of a user based on address
    const totalClaimedReward = user.claimedReward;
    const totalReward = user.reward;

    res.status(200).json({ totalClaimedReward, totalReward });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.claimReward = async (req, res) => {
  try {
    const { address, nftID, nftAddress } = req.body;
    const nft = await NFT.findOne({ nftID, nftAddress });
    const user = await User.findOne({ address });

    if (nft.lastClaimed) {
      // check if nft is claimed today
      const todaysDay = new Date().getDate();
      const todaysMonth = new Date().getMonth() + 1;
      const todaysYear = new Date().getFullYear();

      const lastClaimedDay = new Date(nft.lastClaimed).getDate();
      const lastClaimedMonth = new Date(nft.lastClaimed).getMonth() + 1;
      const lastClaimedYear = new Date(nft.lastClaimed).getFullYear();

      // console.log(todaysDay, todaysMonth, todaysYear);

      // console.log(lastClaimedDay, lastClaimedMonth, lastClaimedYear);
      // console.log(
      //   todaysDay === lastClaimedDay &&
      //     todaysMonth === lastClaimedMonth &&
      //     todaysYear === lastClaimedYear
      // );
      if (
        todaysDay === lastClaimedDay &&
        todaysMonth === lastClaimedMonth &&
        todaysYear === lastClaimedYear
      ) {
        return res.status(400).send("Already claimed today");
      }
      if (nft.claimedDays + 1 === 7) {
        nft.claimedDays = nft.level === 3 ? nft.claimedDays + 1 : 0;
        nft.level = nft.level === 3 ? 3 : nft.level + 1;
        if (nft.level !== nft.prevLevel) {
          nft.prevLevel = nft.level;
        }
        nft.rewardType =
          nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
        nft.lastClaimed = new Date();
      } else {
        nft.claimedDays = nft.claimedDays + 1;
        nft.lastClaimed = new Date();
      }
      // user.reward = user.reward + nft.rewardType;
    } else {
      nft.claimedDays = 1;
      nft.level = nft.level;
      nft.rewardType =
        nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
      nft.lastClaimed = new Date();

      // user.reward = user.reward + nft.rewardType;
    }

    // calculate lucky nft reward
    const luckyNft = await LuckyNFT.findOne({
      nftType: nftAddress === NFT_1_ADDRESS ? 1 : 2,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    if (luckyNft) {
      const todaysDay = new Date().getDate();
      const todaysMonth = new Date().getMonth() + 1;
      const todaysYear = new Date().getFullYear();

      const luckyNFTDay = new Date(luckyNft.createdAt).getDate();
      const luckyNFTMonth = new Date(luckyNft.createdAt).getMonth() + 1;
      const luckyNFTYear = new Date(luckyNft.createdAt).getFullYear();

      if (
        luckyNft.nft.toString() === nft._id.toString() &&
        todaysDay === luckyNFTDay &&
        todaysMonth === luckyNFTMonth &&
        todaysYear === luckyNFTYear
      ) {
        user.reward = user.reward + luckyNft.rewardAmount;
      } else {
        user.reward = user.reward + nft.rewardType;
      }
    } else {
      user.reward = user.reward + nft.rewardType;
    }

    await nft.save();
    await user.save();

    res.status(200).send("Claimed reward successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.claimRewardAll = async (req, res) => {
  try {
    // send the type of nft to claim in request
    const { nftType } = req.query;
    const { address } = req.params;
    const user = await User.findOne({ address });

    let nfts = user.nfts;
    if (nftType == 1) {
      nfts = nfts.filter((nft) => nft.address === NFT_1_ADDRESS);
    } else if (nftType == 2) {
      nfts = nfts.filter((nft) => nft.address === NFT_2_ADDRESS);
    } else {
      return res.status(400).send("Invalid nft type");
    }

    // Itrate through all nfts
    for (let i = 0; i < nfts.length; i++) {
      const nftID = nfts[i].id;
      const nftAddress = nfts[i].address;
      const nft = await NFT.findOne({ nftID, nftAddress });

      if (nft.lastClaimed) {
        // check if nft is claimed today
        const todaysDay = new Date().getDate();
        const todaysMonth = new Date().getMonth() + 1;
        const todaysYear = new Date().getFullYear();

        const lastClaimedDay = new Date(nft.lastClaimed).getDate();
        const lastClaimedMonth = new Date(nft.lastClaimed).getMonth() + 1;
        const lastClaimedYear = new Date(nft.lastClaimed).getFullYear();

        if (
          todaysDay === lastClaimedDay &&
          todaysMonth === lastClaimedMonth &&
          todaysYear === lastClaimedYear
        ) {
          continue;
        }
        if (nft.claimedDays + 1 === 7) {
          nft.claimedDays = nft.level === 3 ? nft.claimedDays : 0;
          nft.level = nft.level === 3 ? 3 : nft.level + 1;
          if (nft.level !== nft.prevLevel) {
            nft.prevLevel = nft.level;
          }
          nft.rewardType =
            nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
          nft.lastClaimed = new Date();
        } else {
          nft.claimedDays = nft.claimedDays + 1;
          nft.lastClaimed = new Date();
        }
        // user.reward = user.reward + nft.rewardType;
      } else {
        nft.claimedDays = 1;
        nft.level = nft.level;
        nft.rewardType =
          nft.nftAddress === NFT_1_ADDRESS ? nft.level : nft.level * 0.5;
        nft.lastClaimed = new Date();

        // user.reward = user.reward + nft.rewardType;
      }

      // calculate lucky nft reward
      const luckyNft = await LuckyNFT.findOne({
        nftType: nftAddress === NFT_1_ADDRESS ? 1 : 2,
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      });

      if (luckyNft) {
        const todaysDay = new Date().getDate();
        const todaysMonth = new Date().getMonth() + 1;
        const todaysYear = new Date().getFullYear();

        const luckyNFTDay = new Date(luckyNft.createdAt).getDate();
        const luckyNFTMonth = new Date(luckyNft.createdAt).getMonth() + 1;
        const luckyNFTYear = new Date(luckyNft.createdAt).getFullYear();

        if (
          luckyNft.nft.toString() === nft._id.toString() &&
          todaysDay === luckyNFTDay &&
          todaysMonth === luckyNFTMonth &&
          todaysYear === luckyNFTYear
        ) {
          user.reward = user.reward + luckyNft.rewardAmount;
        } else {
          user.reward = user.reward + nft.rewardType;
        }
      } else {
        user.reward = user.reward + nft.rewardType;
      }

      await nft.save();
      await user.save();
    }

    res.status(200).send("Claimed reward successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.finalClaim = async (req, res) => {
  const { address } = req.params;
  const web3 = new Web3(Web3.givenProvider || rpc);
  const user = await User.findOne({ address });
  const totalReward = user.reward;
  // check if user has points in hervest contract
  const hervest = new web3.eth.Contract(
    HERVEST_ABI,
    process.env.HERVEST_ADDRESS
  );
  let points = await hervest.methods.points(address).call();
  points = web3.utils.fromWei(points.toString(), "ether");

  if (totalReward + points === 0)
    return res.status(400).send("No reward to claim");
  if (totalReward != 0) {
    const status = await services.updateUserRewardInChain(address, totalReward);
    if (!status)
      return res
        .status(400)
        .send("Claimed reward failed. Please try again later");

    user.reward = 0;
    user.claimedReward = user.claimedReward + totalReward;
    await user.save(); // update user in db
  }

  res.status(200).send("Claimed reward successfully");
};

exports.selectLuckyNft = async (req, res) => {
  const nftType = req.params.nftType;
  const { rewardAmount } = req.body;

  // return error if already selected today
  const isExists = await LuckyNFT.findOne({
    nftType,
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
  });

  if (isExists) return res.status(400).send("Already selected for today !");

  let nfts = [];

  if (nftType == 1) {
    nfts = await NFT.find({ nftAddress: NFT_1_ADDRESS });
  } else {
    nfts = await NFT.find({ nftAddress: NFT_2_ADDRESS });
  }

  if (nfts.length <= 0) return res.status(400).send("No nfts found");

  const sortedNft = [...nfts].sort((a, b) => a.rarity - b.rarity);
  const rarityRanks = sortedNft.map((nft) => nft.rarity);
  let randomIndex = -1;
  const lastLuckyNft = await LuckyNFT.find()
    .populate("nft")
    .sort({ createdAt: -1 })
    .limit(1);

  while (randomIndex < 0) {
    randomIndex = weightedRandomNumber(rarityRanks);
    if (lastLuckyNft.length > 0) {
      if (
        lastLuckyNft[0].nft.nftID === sortedNft[randomIndex].nftID &&
        lastLuckyNft[0].nft.nftAddress === sortedNft[randomIndex].nftAddress
      ) {
        randomIndex = -1;
      }
    }
  }

  const luckyNft = sortedNft[randomIndex];

  // save lucky nft in db
  await LuckyNFT.create({
    nft: luckyNft._id,
    nftType: nftType,
    rewardAmount,
  });

  res.send({ nft: luckyNft });
};

exports.getAllLuckyNfts = async (req, res) => {
  const nftType = req.params.nftType;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const count = await LuckyNFT.countDocuments({ nftType });
  const luckyNfts = await LuckyNFT.find({ nftType })
    .populate("nft")
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });

  res.send({ nfts: luckyNfts, count });
};

exports.getLuckyWinner = async (req, res) => {
  try {
    // find luck nft from db based on nftType and todays date
    const luckyNftBrainy = await LuckyNFT.findOne({
      nftType: 1,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    }).populate("nft");

    const luckyNftWeary = await LuckyNFT.findOne({
      nftType: 2,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    }).populate("nft");

    res.send({ luckyNftBrainy, luckyNftWeary });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

exports.authenticate = async (req, res) => {
  try {
    const { address } = req.params;

    const admin = await Admin.findOne({ address });
    if (!admin) return res.status(403).json({ isAuthenticated: false });

    return res.status(200).json({ isAuthenticated: true });
  } catch (err) {
    return res.status(500).json({ isAuthenticated: false });
  }
};
