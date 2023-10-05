const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    name: String,
    surname: String,
    email : {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false,
    },
    height: Number,
    weight: Number,
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'], 
    }, 
    profilePhoto: {
        type: String,
        required: false,
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    }],
});

const Patient = mongoose.model('Patient',patientSchema);
module.exports = Patient;