const doctorModel = require('../models/Doctor');
const patientModel = require('../models/Patient');

async function checkEmail(email){
    const doctorEmail = await doctorModel.findOne({email}).select("+password");;
    const patientEmail = await patientModel.findOne({email}).select("+password");

    if(doctorEmail !==null || patientEmail !==null){
        const user = doctorEmail !== null ? doctorEmail:patientEmail;
        return {success:false, messages: 'Bu email kullanılmakta', login:true, user:[user]};
    }

    return {success:true, messages: 'Bu email kullanılmamakta', login:false};
}

module.exports = checkEmail;