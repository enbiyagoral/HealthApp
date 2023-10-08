const { func } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    name: String,
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patient : {
        type: Schema.Types.ObjectId,
        ref: 'Patient',  
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    isAvailable: {
        type: Boolean,
        default: true, 
    },
});

const Appointment = mongoose.model('Appointment',appointmentSchema);
module.exports = Appointment;