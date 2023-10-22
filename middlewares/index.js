const services = require("../services");
const Admin = require("../models/Admin");

exports.verifyOwnerValidateLevel = async (req, res, next) => {
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    const { address } = req.params;
    const admin = await Admin.findOne({ address });
    if (!admin) {
      return res.status(403).send("You are not an admin!");
    }
    next();
  } catch (error) {
    return res.status(500).send("Something went wrong!");
  }
};
