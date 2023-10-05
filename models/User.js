const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profilePhoto: String,
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    }],
});

const doctorSchema = new Schema({
    specialization: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        default: 0,
    },
    iban: String,
    location: String,
    isVerify: {
        type: Boolean,
        default: false,
    },
});

const patientSchema = new Schema({
    height: Number,
    weight: Number,
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'],
    },
});


const User = mongoose.model('User', userSchema);
const Doctor = User.discriminator('Doctor', doctorSchema);
const Patient = User.discriminator('Patient', patientSchema);

module.exports = {
    User,
    Doctor,
    Patient,
};
