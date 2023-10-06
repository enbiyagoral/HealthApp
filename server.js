const express = require('express');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./router/authRouter');
const doctorRouter = require('./router/doctorRouter');
const MongoStore = require('connect-mongo');

const app = express();


app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
}));

// app.use("*",(req,res,next)=>{
//     req.session.userRole = req.user.__t
//     userIN = req.session.userID;
//     next();
// });

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connected!");
    }).catch(err=>{
        console.log({msg:err});
    });

app.use('/api/auth',authRouter);
app.use('/api/doctor',doctorRouter);


const port = 3000 || process.env.PORT;
app.listen(port,()=>{
    console.log(`Server starting on ${port}`);
})