const nodemailer = require('nodemailer');

function sendMail(email, otp){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // TLS kullanılıyor
        auth: {
          user: process.env.ETHERAL_MAIL,
          pass: process.env.ETHERAL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.ETHERAL_MAIL,
        to: email,
        subject: 'Doğrulama Kodu | HealtApp',
        html: `
            <h1>Merhaba!</h1>
            <p>Doğrulama Kodunuz: ${otp}</p>
        `,

        
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('E-posta gönderme hatası: ' + error);
        } else {
          console.log('E-posta önizleme URL: ' + nodemailer.getTestMessageUrl(info));
        }
    });
};
  
module.exports = { sendMail };