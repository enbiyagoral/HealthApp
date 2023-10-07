const express = require('express');
const Router = express.Router();
const { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment} = require('../controllers/appointmentController');
const checkRole = require('../middlewares/checkRole');

// api/user/create
Router.post('/create', checkRole('Doctor'), createAppointment);
Router.get('/appointments', checkRole('Doctor'), getAppointments);
Router.get('/appointments/:id', checkRole('Doctor'), getAppointment);
Router.patch('/appointments/:id', checkRole('Doctor'), updateAppointment);
Router.delete('/appointments/:id', checkRole('Doctor'), deleteAppointment);

module.exports = Router;