const express = require('express');
const Router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const {getAppointments, getAppointment,joinAppointment, leaveAppointment, updatePatientUser, getProfilePhoto,updateProfilePhoto, getPatientUser } = require('../controllers/patientController');
const checkRole = require('../middlewares/checkRole');


Router.get('/appointments', checkRole('Patient'), getAppointments);
Router.get('/appointments/:id', checkRole('Patient'), getAppointment);
Router.post('/join', checkRole('Patient'), joinAppointment);
Router.post('/leave/:id', checkRole('Patient'), leaveAppointment);
Router.post('/update', checkRole('Patient'), updatePatientUser );
Router.post('/update-profile-photo', checkRole('Patient'), upload.single('profilephoto'), updateProfilePhoto)
Router.get('/profile-photo', checkRole('Patient'), getProfilePhoto)

Router.get('/profile/', checkRole('Patient'), getPatientUser);
Router.get('/profile/:id', checkRole('Patient'), getPatientUser);



module.exports = Router;