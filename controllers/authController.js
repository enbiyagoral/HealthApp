const bcrypt = require('bcrypt');
const {uploadProfilePhoto} = require('../controllers/s3Controller');

const {Doctor, Patient} = require('../models/User');
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
  
    try {
        let user;

        if (role === 'doctor') {
            user = new Doctor({
                name,
                surname,
                email,
                password: hashedPassword,
                specialization,
                profilePhoto: checkPhoto.Location,
                iban,
                location,
            });
        } else if (role === 'patient') {
            user = new Patient({
                name,
                surname,
                email,
                password: hashedPassword,
                height,
                weight,
                profilePhoto: checkPhoto.Location,
                bloodGroup,
            });
        }
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Kullanıcı oluşturuldu!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Kullanıcı oluşturma hatası: ' + error.message,
        });
    }
};

async function login(req,res){
    const { email, password } = req.body;

    const check = await checkEmail(email);

    if(!check.login){
        return res.send("Email veya şifre hatalı!");
    };

    const user = check.user;
    const isTrue = await bcrypt.compare(password,user.password);

    if(!isTrue){
        return res.send("Email veya şifre hatalı!");
    }

    return res.send("Giriş başarılı!");
}

module.exports = { register, login };