const bcrypt = require('bcrypt');
const {uploadProfilePhoto} = require('../controllers/s3Controller');

const {Doctor, Patient} = require('../models/User');
const checkEmail = require('../utils/checkEmail');
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

        req.session.loggedIn = true;
        req.session.userRole = user.__t;
        req.session.userId = user._id;

        return new Response(200, "Giriş başarılı!").success(res);
        
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

module.exports = { register, login, logout };