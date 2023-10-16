const express = require('express');
const Router = express.Router();
const {getAppointments, getAppointment,joinAppointment, leaveAppointment, updatePatientUser, getPatientUser } = require('../controllers/patientController');
const checkRole = require('../middlewares/checkRole');


Router.get('/appointments', checkRole('Patient'), getAppointments);
Router.get('/appointments/:id', checkRole('Patient'), getAppointment);
Router.post('/join/:id', checkRole('Patient'), joinAppointment);
Router.post('/leave/:id', checkRole('Patient'), leaveAppointment);
Router.post('/update', checkRole('Patient'), updatePatientUser);
Router.get('/update', checkRole('Patient'), getPatientUser);



module.exports = Router;