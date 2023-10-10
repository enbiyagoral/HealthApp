const { Doctor } = require('../models/User');
const Appointment = require('../models/Appointments');
const Response = require('../utils/response');

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
    
    return new Response(201,'Randevu oluşturuldu!',cas).created(res);
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

module.exports = { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment};