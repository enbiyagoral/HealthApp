const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./router/authRouter');
const doctorRouter = require('./router/doctorRouter');
const patientRouter = require('./router/patientRouter');
const MongoStore = require('connect-mongo');

const app = express();

const nodeEnv = process.env.NODE_ENV || 'development';
const mongoURI = (nodeEnv === 'test')
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;


app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongoURI,
    })
}));


if(nodeEnv !== 'test'){
// MongoDB veritabanına bağlanın
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`MongoDB connected - ${nodeEnv}`);
      // Uygulama başlatma veya diğer işlemleri burada yapabilirsiniz.
    })
    .catch((err) => {
      console.error('MongoDB Connection Error:', err);
    });
}



app.use('/api/auth',authRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/patient',patientRouter);


const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server starting on ${port}`);
})

module.exports = app;

