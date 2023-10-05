const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
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
    specialization: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        required: false,
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment', // Randevular için başka bir koleksiyona (Appointments) referans veriyoruz.
    }],
    rate: {
        type: Number,
        default: 0
    },
    iban: String,
    location: String,
    isVerify: {
        type: Boolean,
        default: false,
    },
});

// const locationSchema = new Schema({
//     city: String,
//     hospitalName: String,
// });


const Doctor = mongoose.model('Doctor',doctorSchema);

module.exports = Doctor;