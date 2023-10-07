const mongoose = require('mongoose');
const { Schema } = mongoose;


const locationSchema = new Schema({
    city: String,
    hospitalName: String,
});


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
    rank: {
        type: String,
        enum: ['Junior Doctor', 'Senior Doctor', 'Consultant', 'Specialist', 'Chief Doctor'],
        default: 'Junior Doctor', 
    },
    rate: {
        type: Number,
        default: 0,
    },
    iban: String,
    location: locationSchema,
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


userSchema.index({ email: 1 });
userSchema.index({ appointments: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'location.city': 1, 'location.hospitalName': 1 });



const User = mongoose.model('User', userSchema);
const Doctor = User.discriminator('Doctor', doctorSchema);
const Patient = User.discriminator('Patient', patientSchema);


module.exports = {
    User,
    Doctor,
    Patient,
};
