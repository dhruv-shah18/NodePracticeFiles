const express = require('express');
const router = express.Router();
const { createNewUser, loginUser, logoutUser } = require('../controllers/usersController');

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
