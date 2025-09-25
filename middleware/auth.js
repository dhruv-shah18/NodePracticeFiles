const jwt = require("jsonwebtoken");
const User  = require("../models/User.model");

// TODO : Verify jwt token and extract user id
// TODO : Extract user information from DB
// TODO : Add user information to req object

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email : decoded.userId });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid / User not found.",err });
  }
};

module.exports = auth;