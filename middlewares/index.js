const services = require("../services");
const User = require("../models/UserModel");
const NFT = require("../models/NFTModel");

exports.verifyOwnerValidateLevel = async (req, res, next) => {
  next();
};
