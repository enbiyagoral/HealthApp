const { Patient } = require('../models/User');
const Appointment = require('../models/Appointments');
const Response = require('../utils/response');


async function getAppointments(req,res){
    const appointments = await Appointment.find({
        patient:req.session.userId,
    }).populate('doctor patient','name email -__t');
    res.send(appointments); 
};

async function getAppointment(req,res){
    const id = req.params.id;
    const appointment = await Appointment.find({
        _id:id,
    }).populate('doctor patient','name email -__t');
    res.send(appointment); 
};

async function joinAppointment(req,res){
    const id = req.params.id;
    const patient = await Patient.findById(req.session.userId);
    const appointment = await Appointment.findById(id);
    // Randevu tarafı:
    if(appointment.isAvailable == true){
        appointment.patient = patient;
        appointment.isAvailable = false;
        await appointment.save();
    
        // Hasta tarafı
        patient.appointments.push(appointment);
        await patient.save();
    
        const data = await appointment
                        .populate('doctor patient','name -_id -__t ')
                        
        return res.send(data);
    }else{
        return res.send("Randevu uygun değil");
    }
};

async function leaveAppointment(req,res){
    const id = req.params.id;
    const patient = await Patient.findById(req.session.userId);
    const appointment = await Appointment.findById(id);
    // hasta tarafı:
    if(appointment.patient != null){
        appointment.isAvailable = true;
        appointment.patient.equals(req.session.userId);
        appointment.patient = null;
    
        appointment.save();
        console.log(appointment);
    
        await Patient.findByIdAndUpdate(patient._id, {
            $pull: { appointments: appointment._id },
        });
    
        res.send("Randevu başarıyla iptal edildi.");
    }else{
        res.send('Randevuya önce kayıt olmanız gerekmektedir.');
    }
    
};

async function updatePatientUser(req,res){
    const { height, weight, bloodGroup } = req.body; 
    console.log(height);
    try {
        const patient = await Patient.findById(req.session.userId);

        patient.height= height;
        patient.weight= weight;
        patient.bloodGroup= bloodGroup;

        await patient.save();

        if (!patient) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        console.log(req.session.userId);
        res.status(200).json({ message: "Kullanıcı başarıyla güncellendi." });
    } catch (error) {
        res.status(500).json({ message: "Bir hata oluştu." });
    }
}

async function getPatientUser(req,res){
    try {
        const patient = await Patient.findById(req.session.userId);
        const data = {
            "fullName": patient.fullName,
            "bloodGroup" : patient.bloodGroup,
            "height": patient.height,
            "weight": patient.weight,
            "MassIndex": patient.MassIndex
        }
        if (!patient) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        return new Response(200,"Kullanıcı getirildi", data).success(res);
    } catch (error) {
        res.status(500).json({ message: "Bir hata oluştu." });
    }
}


module.exports = { getAppointment, getAppointments, joinAppointment, leaveAppointment, updatePatientUser, getPatientUser};

