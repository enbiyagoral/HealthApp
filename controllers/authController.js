const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator')
const {uploadProfilePhoto} = require('../controllers/s3Controller');
const { client } = require('../config/redis');

const {Doctor, Patient, User} = require('../models/User');
const checkEmail = require('../utils/checkEmail');
const {sendMail} = require('../utils/sendMail');
const Response = require('../utils/response');


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

        return new Response(400,check_Email.messages).error400(res);
    }

    try {
        let user;

        if (role === 'doctor') {
            user = new Doctor({
                name,
                surname,
                email,
                password,
                specialization,
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
                // height,
                // weight,
                // bloodGroup,
            });
        }

        await user.save();
        return new Response(201,'Kullanıcı oluşturuldu!').created(res);
        
    } catch (error) {       

        return new Response(500).error500(res);

    }
}


async function login(req, res) {
    const { email, password } = req.body;

    try {
        const check = await checkEmail(email);

        if (!check.login) {

            return new Response(401,"Email veya şifre hatalı!").unauthorized(res);
            
        }

        const user = check.user;
        const isTrue = await bcrypt.compare(password, user.password);

        if (!isTrue) {

            return new Response(401,"Email veya şifre hatalı!").unauthorized(res);

        }

        const token = jwt.sign({
            loggedIn : true,
            userRole : user.__t,
            userId : user._id
        }, process.env.JWT_PRIVATE_KEY);

        if(!user.isVerify){

            return res.redirect(`/api/auth/generate-otp/${user._id}`);
        }

        return new Response(200, "Giriş başarılı!", token).success(res);
        
    } catch (error) {

        return new Response(500).error500(res);
        
    }
}

async function logout(req,res){
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Kullanıcı oturumu sonlandırıldı.");
        }
        res.redirect('/api/auth/login'); 
    });
}

async function verifyOTP(req,res){
    const id = req.params.id;
    const user = await User.findById(id);
    const {verifyCode} = req.body;

    const code = await client.get(`otp-${user.email}`);
    if(code === verifyCode){
        user.isVerify = true;
        await user.save();
        await client.del(`otp-${user.email}`);
        return new Response(200, "Doğrulama Başarılı").success(res);
    }else{
        return new Response(403).unauthorized(res);
    }
};
async function generateOTP(req,res){
    const id = req.params.id;
    const user = await User.findById(id);
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false});
    sendMail(user.email, otp);
    await client.set(`otp-${user.email}`,otp);
    return new Response(200, "OTP Gönderildi!").success(res);
};

module.exports = { register, login, verifyOTP,generateOTP, logout };