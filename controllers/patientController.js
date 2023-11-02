const { Patient, Doctor } = require('../models/User');
const Appointment = require('../models/Appointments');
const Response = require('../utils/response');
const {uploadProfilePhoto } = require('../controllers/s3Controller');
const {convertDate} = require('../utils/calculateAge');
const {isRestDay} = require('../utils/isRestDay');

const { client } = require('../config/redis');

async function getAppointments(req,res){
    const latest = req.query.latest === "1" ? true : false;
    
    
    if(latest){
        const lastAppointment = await Appointment.find({
            patient:req.user.userId,
        }).populate('doctor patient','name specialization location email -__t -_id').sort({ date: -1 }).limit(1).lean();

        return new Response(200, "Son randevu getirildi!", lastAppointment).success(res);
    }

    const appointments = await Appointment.find({
        patient:req.user.userId,
    }).populate('doctor patient','name specialization location email -__t -_id').sort({ date: 1 });


    return new Response(200, "Tüm randevular getirildi!", appointments).success(res);
};

async function getAppointment(req,res){
    const id = req.params.id;
    const appointment = await Appointment.find({
        _id:id,
    }).populate('doctor patient','name email -__t');
    res.send(appointment); 
};


async function joinAppointment(req,res){
    const { doctorId, date } = req.body;

    const patient = await Patient.findById(req.user.userId);
    const doctor = await Doctor.findById(doctorId);
    

    if(doctor.isRest){
        return new Response(400,"Doktor İzinde").error400(res);
    };

    const restDates = doctor.restDays.restDates;
    let availibleTimes = doctor.availibleTimes;
    const isRest = isRestDay(restDates, date);

    if(isRest){
        return new Response(200, "Doktor İzinde").success(res);
    }

    availibleTimes = availibleTimes.map((time)=> time.toISOString());

    const isExists = await client.exists(`${doctor._id}`);

    if(isExists==0){
        await client.rPush(`${doctor._id}`, availibleTimes);
        const expirationTimeInSeconds = 86400;    
        await client.expire(`${doctor._id}`, expirationTimeInSeconds);    
    }
    
    const isDateAvailable = availibleTimes.includes(date); 
    if(!isDateAvailable){
        return res.send("Geçersiz tarih verisi girdiniz!");
    }

    const isAvailable = await Appointment.find({date}).count();
    if(isAvailable>0){
        return res.send("Randevu dolu!");
    };

    const appointment = new Appointment({
        name: doctor.specialization,
        doctor,
        patient,
        date,
        isAvailable: false,
    });

    await appointment.save();

    doctor.appointments.push(appointment);
    await doctor.save();

    patient.appointments.push(appointment);
    await patient.save();

    res.send(appointment);
};

async function leaveAppointment(req,res){
    const id = req.params.id;
    const patient = await Patient.findById(req.user.userId);
    const appointment = await Appointment.findById(id);
    // hasta tarafı:
    if(appointment.patient != null){
        appointment.isAvailable = true;
        appointment.patient.equals(req.user.userId);
        appointment.patient = null;
        appointment.date = null,
    
        await appointment.save();
    
        await Patient.findByIdAndUpdate(patient._id, {
            $pull: { appointments: appointment._id },
        });
    
        res.send("Randevu başarıyla iptal edildi.");
    }else{
        res.send('Randevuya önce kayıt olmanız gerekmektedir.');
    }
    
};

async function getProfilePhoto(req,res){
    try {
        const patient = await Patient.findById(req.user.userId);

        if (!patient) {
            return new Response(404,"Error", "Kullanıcı bulunamadı.").error404(res);
        }
      
        return new Response(200, null, patient.profilePhoto).success(res);

        } catch (error) {
            return new Response(500,"Error", error.message).error500(res);
        }
}


async function updateProfilePhoto(req,res){
    try {
        console.log(req.user);
        const patient = await Patient.findById(req.user.userId);
        if (!patient) {
            return new Response(404,"Error", "Kullanıcı bulunamadı.").error404(res);
        }

        const profilePhoto = req.file;
        const checkPhoto = await uploadProfilePhoto(req.user.userId, profilePhoto);
        patient.profilePhoto =  checkPhoto.Location;
        await patient.save();
            
        return new Response(200, "Profil fotoğrafı yüklendi!").success(res);

        } catch (error) {
            return new Response(500,"Error", error.message).error500(res);
        }
}

async function updatePatientUser(req,res){
    try {
        const { name, surname, height, weight, bloodGroup, birthDate } = req.body;   
        const patient = await Patient.findById(req.user.userId);

        if (!patient) {
            return new Response(404,"Error", "Kullanıcı bulunamadı.").error404(res);
        }

        patient.birthDate = new Date(convertDate(birthDate));
        patient.name= name;
        patient.surname= surname;
        patient.height= height;
        patient.weight= weight;
        patient.bloodGroup= bloodGroup;

        await patient.save();
          
        return new Response(200, "Kullanıcı başarıyla güncellendi.").success(res);

        } catch (error) {
            return new Response(500,"Error", error.message).error500(res);
        }
}



async function getPatientUser(req,res){
    try {
        const id = req.params.id;

        if(id){
            const doctor = await Doctor.findById(req.params.id);
            if(!doctor){
                return res.status(404).json({ message: "Kullanıcı bulunamadı." }); 
            }
            return new Response(200,"Kullanıcı getirildi", doctor).success(res);
        }

        const patient = await Patient.findById(req.user.userId);
        if (!patient) {
            

        }

        const data = {
                "fullName": patient.fullName,
                "bloodGroup" : patient.bloodGroup,
                "height": patient.height,
                "weight": patient.weight,
                "MassIndex": patient.MassIndex,
                "age": patient.age,
                "appointments": patient.appointments
        }
        

        return new Response(200,"Kullanıcı getirildi", data).success(res);

    } catch (error) {
        res.status(500).json({ message: "Bir hata oluştu." });
    }
};


module.exports = { getAppointment, getAppointments, joinAppointment, leaveAppointment, updatePatientUser, getProfilePhoto,updateProfilePhoto,getPatientUser};

