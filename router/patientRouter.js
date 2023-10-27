const express = require('express');
const Router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const {getAppointments, getAppointment,joinAppointment, leaveAppointment, updatePatientUser, getPatientUser } = require('../controllers/patientController');
const checkRole = require('../middlewares/checkRole');


Router.get('/appointments', checkRole('Patient'), getAppointments);
Router.get('/appointments/:id', checkRole('Patient'), getAppointment);
Router.post('/join', checkRole('Patient'), joinAppointment);
Router.post('/leave/:id', checkRole('Patient'), leaveAppointment);
Router.post('/update', upload.single('profilephoto'), checkRole('Patient'),  updatePatientUser);
Router.get('/profile', checkRole('Patient'), getPatientUser);



module.exports = Router;