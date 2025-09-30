const express = require('express');
const router = express.Router();
const { createNewUser, loginUser, logoutUser, deleteUser } = require('../controllers/usersController');

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/deleteuser/:id', deleteUser);

module.exports = router;
