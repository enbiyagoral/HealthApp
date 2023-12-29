const express = require('express');
const { register, login, verifyOTP,generateOTP,logout} = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', register);
Router.post('/login', login);
Router.post('/verify/:id', verifyOTP);
Router.get('/generate-otp/:id', generateOTP);

Router.post('/logout', logout);

module.exports = Router;