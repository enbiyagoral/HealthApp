const fs = require('fs');
const {s3} = require('../config/aws');
const dotenv = require('dotenv');
dotenv.config();

async function uploadProfilePhoto(email, file){
    const yeniEmail = email.replace(/\.com$/, ".jpeg");
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Body: fileStream,
        Key: yeniEmail
    }
    return s3.upload(uploadParams).promise();
};

module.exports = {uploadProfilePhoto}
