const { Doctor } = require('../models/User');
const Appointment = require('../models/Appointments');

async function createAppointment(req,res){
    const { name } = req.body;
    const doctor = await Doctor.findById(req.session.userId);

    const appointment = new Appointment({
        name: name,
        doctor: doctor._id,
    })

    await appointment.save();

    const cas =  await appointment.populate('doctor', '-_id -iban -isVerify -__v  -__t -appointments');

    doctor.appointments.push(appointment._id);
    await doctor.save();
    
    res.send(cas);
};


module.exports = { createAppointment};