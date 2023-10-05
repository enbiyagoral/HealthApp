const express = require('express');
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const { register, login } = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', upload.single('profilephotos'), register);
Router.post('/login', login);

module.exports = Router;