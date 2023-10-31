const fs = require('fs');
const {s3} = require('../config/aws');
const dotenv = require('dotenv');
dotenv.config();

async function uploadProfilePhoto(id, file){
    const fileStream = fs.createReadStream(file.path);
    const keyString = `${id}.jpeg`;
    
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Body: fileStream,
        Key: keyString
    }
    return s3.upload(uploadParams).promise();
};

async function getProfilePhoto(key){
    try {
        const getParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: key
        };
        const readableStream = await s3.getObject(getParams).createReadStream();
        return readableStream;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {uploadProfilePhoto, getProfilePhoto}
