const express = require('express');
const { register, login ,logout} = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', register);
Router.post('/login', login);
Router.post('/logout', logout);

module.exports = Router;