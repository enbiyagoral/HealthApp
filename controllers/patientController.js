const { Patient } = require('../models/User');
const Appointment = require('../models/Appointments');
const Response = require('../utils/response');
const {uploadProfilePhoto, getProfilePhoto } = require('../controllers/s3Controller');
const {calculateAge, convertDate} = require('../utils/calculateAge');

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
    
        await Patient.findByIdAndUpdate(patient._id, {
            $pull: { appointments: appointment._id },
        });
    
        res.send("Randevu başarıyla iptal edildi.");
    }else{
        res.send('Randevuya önce kayıt olmanız gerekmektedir.');
    }
    
};

async function updatePatientUser(req,res){
    try {
        const pf = req.query.pf == "1"? true:false;
        const patient = await Patient.findById(req.session.userId);
        
            // S3'e fotoğraf yükleme
        if(pf){
            const profilePhoto = req.file;
            const checkPhoto = await uploadProfilePhoto(req.session.userId, profilePhoto);
            patient.profilePhoto =  checkPhoto.Location;
        }else{
            const { height, weight, bloodGroup, birthDate } = req.body;   
            patient.birthDate = new Date(convertDate(birthDate));
            patient.height= height;
            patient.weight= weight;
            patient.bloodGroup= bloodGroup;
        }
        await patient.save();
        
        if (!patient) {
            return new Response(404,"Error", "Kullanıcı bulunamadı.").error404(res);
        }
            
        return new Response(200, "Kullanıcı başarıyla güncellendi.").success(res);

        } catch (error) {
            return new Response(500,"Error", error.message).error500(res);
        }
}

async function getPatientUser(req,res){
    try {
        const gp = req.query.gp == "1"? true: false;
        const patient = await Patient.findById(req.session.userId);

        if(gp){
            const result = await getProfilePhoto(req.session.userId);
            return new Response(200,"Kullanıcı getirildi", data = null).success(res,result);
        }else{
            const data = {
                "fullName": patient.fullName,
                "bloodGroup" : patient.bloodGroup,
                "height": patient.height,
                "weight": patient.weight,
                "MassIndex": patient.MassIndex,
                "age": patient.age
            }
            if (!patient) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı." });
            }
            return new Response(200,"Kullanıcı getirildi", data).success(res);
        }
    } catch (error) {
        res.status(500).json({ message: "Bir hata oluştu." });
    }
};

module.exports = { getAppointment, getAppointments, joinAppointment, leaveAppointment, updatePatientUser, getPatientUser};

