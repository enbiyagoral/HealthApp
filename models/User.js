const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const {calculateAge} = require('../utils/calculateAge');
const {calculateAvailableTimes} = require('../utils/calculateAppointments');
const { number } = require('joi');

const locationSchema = new Schema({
    city: String,
    hospitalName: String,
});

const workingTimeSchema = new Schema({
    days: [{ 
        type: Number, 
        enum: [0, 1, 2, 3, 4, 5, 6],
        default: [0,1,2,3,4]
    }],
    start: {
        type: String,
        default: "9"
    },  
    end: {
        type: String,
        default: "17"
    },
    workingInterval:{
        type: Number,
        default: 10
    }
});

const restTimeSchema = new Schema({
    totalDays: Number,
    restDates: [{
        type: Date
    }]
})

const userSchema = new Schema({
    name: String,
    surname: String,
    birthDate : Date,
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
    workingHours: {
        type: workingTimeSchema,
    },
    iban: String,
    location: {
        type: locationSchema,
        required:true
    },
    restDays: {
        type: restTimeSchema,
    },
    isRest: {
        type: Boolean,
        default: false
    },
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
        enum: ['A(RH)+', 'A(RH)-', 'B(RH)+', 'B(RH)-', 'AB(RH)+', 'AB(RH)-', '0(RH)+', '0(RH)-'],
    },
});


// Veritabanında fiiziksel yer kaplamaması için bir araya getirdiğim özellikler:
userSchema.virtual('fullName').get(function(){
    return this.name + ' ' + this.surname;
});

doctorSchema.virtual('availibleTimes').get(function(){
    return calculateAvailableTimes(this);
});

userSchema.virtual('age').get(function () {
    if (!this.birthDate) {
      return null;
    }
    return calculateAge(this.birthDate);
  });

patientSchema.virtual('MassIndex').get(function(){
    return (this.weight/((this.height/100)*(this.height/100))).toFixed(2);
});


// Hashleme kısmı:
userSchema.pre('save', async function(next){
    try {
        if(this.isModified('password')){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password,salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
})

// Kullanılan sorgulara göre indexlediğim alanlar:
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
