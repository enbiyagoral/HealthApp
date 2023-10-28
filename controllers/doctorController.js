const { Doctor } = require('../models/User');
const Appointment = require('../models/Appointments');
const Response = require('../utils/response');
const {uploadProfilePhoto, getProfilePhoto } = require('../controllers/s3Controller');
const { convertDate } = require('../utils/calculateAge');
const { getDatesBetweenDates } = require('../utils/betweenDate.js');




async function getProfile(req,res){
  const doctor = await Doctor.findById(req.session.userId);
  return new Response(200, null, doctor).success(res);
};

// async function updateProfile(req,res){
//   try {
//       const pf = req.query.pf == "1"? true:false;
//       const doctor = await Doctor.findById(req.session.userId);
      
//           // S3'e fotoğraf yükleme
//       if(pf){
//           const profilePhoto = req.file;
//           const checkPhoto = await uploadProfilePhoto(req.session.userId, profilePhoto);
//           doctor.profilePhoto =  checkPhoto.Location;
//       }else{
//           const { specialization, rank, iban, name, surname} = req.body;   
//           patient.birthDate = new Date(convertDate(birthDate));
//           patient.height= height;
//           patient.weight= weight;
//           patient.bloodGroup= bloodGroup;
//       }
//       await patient.save();
      
//       if (!patient) {
//           return new Response(404,"Error", "Kullanıcı bulunamadı.").error404(res);
//       }
          
//       return new Response(200, "Kullanıcı başarıyla güncellendi.").success(res);

//       } catch (error) {
//           return new Response(500,"Error", error.message).error500(res);
//       }
// }

async function setWorkingTime(req,res){
  const {days,start, end, workingInterval} = req.body;
  try {
    const updateFields = {
      'workingHours.start': start,
      'workingHours.end': end,
      'workingHours.workingInterval':workingInterval
    }
    
    if (days) {
      updateFields['workingHours.days'] = days;
    }
    
    await Doctor.updateOne(
      { _id: req.session.userId },
      {
        $set: updateFields
      }
    );

    return res.json({ message: 'Çalışma saatleri başarıyla güncellendi.' });
  } catch (err) {
    return res.status(500).json({ error: 'Çalışma saatleri güncellenirken bir hata oluştu.' });
  }

};

async function setRestTime(req,res){
  const {startDate, endDate} = req.body;
  const doctor = await Doctor.findById(req.session.userId);

  const converstartDate = new Date(convertDate(startDate));
  const convertendDate = new Date(convertDate(endDate));

  const datesBetween = getDatesBetweenDates(converstartDate,convertendDate);
  datesBetween.forEach(date => {
    doctor.restDays.restDates.push(date);
  });
  doctor.restDays.totalDays += datesBetween.length;
  
  await doctor.save();
  return new Response(200,"Başarıyla kaydedildi", doctor).success(res);
};

async function getAppointments(req,res){
    const appointments = await Appointment.find({
        doctor:req.session.userId,
    }).select('-doctor -__v');
    return new Response(200,null, appointments).success(res);
};

async function getAppointment(req,res){ // Doktorun tüm randevuları
    const id = req.params.id;
    const appointment = await Appointment.find({
        _id:id,
    }).select('-doctor');
    return new Response(200,null, appointment).success(res);
};

async function updateAppointment(req, res) {
      const id = req.params.id;
      const isAvailable = req.body.isAvailable;
      const appointment = await Appointment.findOne({ _id: id });
  
      if (!appointment) {

        return new Response(404,'Randevu bulunamadı.').error404(res);

      }

      appointment.isAvailable = isAvailable;
      const newAppointment = await appointment.save();

      return new Response(200, null, newAppointment).success(res);
}

async function deleteAppointment(req, res) {
    try {
      const id = req.params.id;
      const appointment = await Appointment.findOne({ _id: id });
      const doctor = await Doctor.findById(req.session.userId);
      
      if (!appointment) {

        return new Response(404,'Randevu bulunamadı.').error404(res);
        
      }
    
  
      // Doktorun randevuları içinde belirli bir randevuyu silin
      doctor.appointments = doctor.appointments.filter(data => data._id.toString() !== appointment._id.toString());
  
      // Doktorun randevularını güncelleyin ve veritabanına kaydedin
      await doctor.save();
  
      // Randevuyu silin
      await Appointment.deleteOne({ _id: appointment._id });
  
      // Güncellenmiş randevuları döndürün
      const appointments = doctor.appointments;

      return new Response(200, null, appointments).success(res);
      
    } catch (error) {

      return new Response(500).error500(res);

    }
}

module.exports = { getProfile, getAppointments, getAppointment, updateAppointment, deleteAppointment, setWorkingTime, setRestTime};