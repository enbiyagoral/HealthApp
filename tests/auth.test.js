const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { func } = require('joi');
dotenv.config();

chai.use(chaiHttp);

before(function (done){
  this.timeout(5000);
  // MongoDB'ye bağlan
  const mongoURI = process.env.TEST_MONGODB_URI
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((value)=>{
    console.log("Test DB Connected");
    done();
  }).catch((error) => {
    console.error("DB Connection Error: ", error.message); // Hata ayıklama bilgilerini logla
    done(error);
  });
});

after(async function() {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log("MongoDB bağlantısı kesildi!");
  } catch (error) {
    console.error("Hata oluştu: ", error);
  }
});

describe('register', ()=>{
   
    it('should register a doctor successfully', function(done){
        
      const doctor = {
          name: 'Test - Doctor Name',
          surname: 'Test - Doctor Name',
          email: 'testdoctor@example.com',
          password: '12342@gsdalmfsa',
          specialization: 'Cardiology',
          iban: 'TR1234567890123456789012342',
          city: 'Test - City',
          hospitalName: 'Test - Hospital Name',
      };

      chai.request(server)
      .post('/api/auth/signup')
      .query({ role: 'doctor'})
      .send(doctor)
      .end((err,res)=>{
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          done();
      });
    });    
    
    it('should register a patient successfully', function(done){
        
      const doctor = {
          name: 'Test - Patient Name',
          surname: 'Test - Patient Name',
          email: 'testpatient@example.com',
          password: '12asdasddalmfsa',
      };

      chai.request(server)
      .post('/api/auth/signup')
      .query({ role: 'patient'})
      .send(doctor)
      .end((err,res)=>{
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          done();
      });
    });    
});

describe('login', () => {
  it('should return 401 when email or password is incorrect', async () => {
    const fakeRequest = {
      body: {
        email: 'fake@example.com',
        password: 'incorrect_password',
      },
    };
    const res = await chai.request(server).post('/api/auth/login').send(fakeRequest);
    expect(res).to.have.status(401);
  });

  it('should return 200 when login is successful', async () => {
    const fakeRequest = {
      body: {
        email: 'testdoctor@example.com',
        password: '12342@gsdalmfsa',
      }
    };

    const res = await chai.request(server).post('/api/auth/login').send(fakeRequest.body);
    expect(res.status).to.equal(200);
  
  });

});

