const express = require('express');
const Router = express.Router();
const { getAppointments} = require('../controllers/appointmentController');

Router.get('/:page', getAppointments)


module.exports = Router;