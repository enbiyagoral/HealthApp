const bcrypt = require('bcrypt');
const {uploadProfilePhoto} = require('../controllers/s3Controller');

const {Doctor, Patient} = require('../models/User');
const checkEmail = require('../utils/checkEmail');
 

async function register(req, res) {
    const role = req.query.role === 'doctor' ? 'doctor' : 'patient';

    const {
        name,
        surname,
        email,
        password,
        specialization,
        height,
        weight,
        iban,
        city,
        hospitalName,
        bloodGroup,
    } = req.body;

    // Email kontrolü
    const check_Email = await checkEmail(email);
    if (!check_Email.success) {
        return res.status(400).json({
            success: false,
            message: check_Email.messages,
        });
    }

    // S3'e fotoğraf yükleme
    const profilePhoto = req.file;
    const checkPhoto = await uploadProfilePhoto(email, profilePhoto);

    try {
        let user;

        if (role === 'doctor') {
            user = new Doctor({
                name,
                surname,
                email,
                password,
                specialization,
                profilePhoto: checkPhoto.Location,
                iban,
                location: {
                    city,
                    hospitalName,
                },
            });
        } else if (role === 'patient') {
            user = new Patient({
                name,
                surname,
                email,
                password,
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
        console.error('Kullanıcı oluşturma hatası:', error);
        return res.status(500).json({
            success: false,
            message: 'Kullanıcı oluşturma hatası: ' + error.message,
        });
    }
}


async function login(req, res) {
    const { email, password } = req.body;

    try {
        const check = await checkEmail(email);

        if (!check.login) {
            return res.status(401).json({
                success: false,
                message: "Email veya şifre hatalı!",
            });
        }

        const user = check.user;
        const isTrue = await bcrypt.compare(password, user.password);

        if (!isTrue) {
            return res.status(401).json({
                success: false,
                message: "Email veya şifre hatalı!",
            });
        }

        req.session.loggedIn = true;
        req.session.userRole = user.__t;
        req.session.userId = user._id;

        return res.status(200).json({
            success: true,
            message: "Giriş başarılı!",
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        return res.status(500).json({
            success: false,
            message: 'Giriş hatası: ' + error.message,
        });
    }
}


module.exports = { register, login };