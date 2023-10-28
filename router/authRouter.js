const express = require('express');
const { register, login, verifyOTP,logout} = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', register);
Router.post('/login', login);
Router.post('/verify/:id', verifyOTP);

Router.post('/logout', logout);

module.exports = Router;