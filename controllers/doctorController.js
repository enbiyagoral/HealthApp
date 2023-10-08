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

async function getAppointments(req,res){
    const appointments = await Appointment.find({
        doctor:req.session.userId,
    }).select('-doctor -__v');
    res.send(appointments); 
};

async function getAppointment(req,res){ // Doktorun tüm randevuları
    const id = req.params.id;
    const appointment = await Appointment.find({
        _id:id,
    }).select('-doctor');
    res.send(appointment); 
};

async function updateAppointment(req, res) {
      const id = req.params.id;
      const isAvailable = req.body.isAvailable;
      const appointment = await Appointment.findOne({ _id: id });
  
      if (!appointment) {
        return res.status(404).json({ error: 'Randevu bulunamadı.' });
      }

      appointment.isAvailable = isAvailable;
      const newAppointment = await appointment.save();

      res.status(200).send(newAppointment);
}

async function deleteAppointment(req, res) {
    try {
      const id = req.params.id;
      const appointment = await Appointment.findOne({ _id: id });
      const doctor = await Doctor.findById(req.session.userId);
      
      if (!appointment) {
        return res.status(404).json({ error: 'Randevu bulunamadı.' });
      }
  
      // Doktorun randevuları içinde belirli bir randevuyu silin
      doctor.appointments = doctor.appointments.filter(data => data._id.toString() !== appointment._id.toString());
  
      // Doktorun randevularını güncelleyin ve veritabanına kaydedin
      await doctor.save();
  
      // Randevuyu silin
      await Appointment.deleteOne({ _id: appointment._id });
  
      // Güncellenmiş randevuları döndürün
      const appointments = doctor.appointments;
      res.status(200).json(appointments);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
}

module.exports = { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment};