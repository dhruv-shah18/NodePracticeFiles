const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/utils');

const hashPassword = async (plainTextPassword) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  return hashedPassword;
};

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '64d',
  });
  return token;
};

const createNewUser = async (req, res) => { 
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    try {
        const user = await User.create({
            username,
            email,
            password : hashedPassword,
        });
        const result = await sendWelcomeEmail(email, username);
        res.status(201).json({ msg: "User created", user });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }
    //TODO: After login, we have generate a jwt token with user id 
    const token = generateToken(user.email);
    // 3. If matched, return success (you can add token logic here if needed)
    res.status(200).json({ msg: 'User logged in successfully', user, access_token: token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the token and user data from local storage
    res.status(200).json({ msg: 'User logged out successfully', success: true  });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message, success: false  });
  }
};

module.exports = {
    createNewUser,
    loginUser,
    logoutUser
};
