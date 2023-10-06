const express = require('express');
const Router = express.Router();
const { createAppointment } = require('../controllers/appointmentController');
const checkRole = require('../middlewares/checkRole');

// api/user/create
Router.post('/create', checkRole('Doctor'), createAppointment);


module.exports = Router;