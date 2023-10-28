const express = require('express');
const Router = express.Router();
const { 
    getAppointments, 
    getAppointment, 
    updateAppointment, 
    setWorkingTime,
    deleteAppointment,
    setRestTime,
    getProfile,
    updateProfile
} = require('../controllers/doctorController');

const checkRole = require('../middlewares/checkRole');

Router.get('/profile', checkRole('Doctor'), getProfile);
Router.post('/profile', checkRole('Doctor'), updateProfile);

Router.get('/appointments', checkRole('Doctor'), getAppointments);
Router.get('/appointments/:id', checkRole('Doctor'), getAppointment);

Router.patch('/appointments/:id', checkRole('Doctor'), updateAppointment);
Router.patch('/workingtimes', checkRole('Doctor'), setWorkingTime);
Router.patch('/resttimes', checkRole('Doctor'), setRestTime);


Router.delete('/appointments/:id', checkRole('Doctor'), deleteAppointment);

module.exports = Router;