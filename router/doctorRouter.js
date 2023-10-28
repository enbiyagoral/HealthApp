const express = require('express');
const Router = express.Router();
const { 
    createAppointment, 
    getAppointments, 
    getAppointment, 
    updateAppointment, 
    setWorkingTime,
    deleteAppointment,
    setRestTime
} = require('../controllers/doctorController');

const checkRole = require('../middlewares/checkRole');

Router.post('/create', checkRole('Doctor'), createAppointment);

Router.get('/appointments', checkRole('Doctor'), getAppointments);
Router.get('/appointments/:id', checkRole('Doctor'), getAppointment);

Router.patch('/appointments/:id', checkRole('Doctor'), updateAppointment);
Router.patch('/workingtimes', checkRole('Doctor'), setWorkingTime);
Router.patch('/resttimes', checkRole('Doctor'), setRestTime);


Router.delete('/appointments/:id', checkRole('Doctor'), deleteAppointment);

module.exports = Router;