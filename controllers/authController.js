const bcrypt = require('bcrypt');
const {uploadProfilePhoto} = require('../controllers/s3Controller');

const doctorModel = require('../models/Doctor');
const patientModel = require('../models/Patient');
const checkEmail = require('../utils/checkEmail');
 

async function register(req,res){
    const role = req.query.role  == "doctor" ? "doctor": "patient";

    const {
        name,
        surname,
        email,
        password,
        specialization,
        height,
        weight,
        iban,
        location,
        bloodGroup
    } = req.body;

    // Email kontrolü
    const check_Email = await checkEmail(email);
    if(!check_Email.success){
        return res.send({"status":check_Email.success, "message": check_Email.messages});
    };

    // S3'e fotoğraf yükleme
    const profilePhoto = req.file;
    const checkPhoto = await uploadProfilePhoto(email, profilePhoto);

    // Şifre hashleme
    const saltrounds = 10;
    const salt = await bcrypt.genSalt(saltrounds);
    const hashedPassword = await bcrypt.hash(password,salt);
  
    if(role==="doctor"){
        const doctor = new doctorModel({
            name,
            surname,
            email,
            password: hashedPassword,
            specialization,
            profilePhoto: checkPhoto.Location,
            iban,
            location
        });

        await doctor.save();
    };

    if(role==="patient"){
        const patient = new patientModel({
            name,
            surname,
            email,
            password: hashedPassword,
            height,
            weight,
            profilePhoto: checkPhoto.Location,
            bloodGroup,
        });

        await patient.save();
    }
    
    res.send("Kullanıcı oluşturuldu!");
};

async function login(req,res){
    const { email, password } = req.body;
    console.log(email,password);

    const check = await checkEmail(email);

    if(!check.login){
        return res.send("Email veya şifre hatalı!");
    };

    const user = check.user[0]
    const isTrue = await bcrypt.compare(password,user.password);

    if(!isTrue){
        return res.send("Email veya şifre hatalı!");
    }

    return res.send("Giriş başarılı!");
}

module.exports = { register, login };