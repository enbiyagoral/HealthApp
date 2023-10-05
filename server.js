const express = require('express');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./router/authRouter');
const app = express();


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connected!");
    }).catch(err=>{
        console.log({msg:err});
    });

app.use('/api/auth',authRouter);

const port = 3000 || process.env.PORT;
app.listen(port,()=>{
    console.log(`Server starting on ${port}`);
})