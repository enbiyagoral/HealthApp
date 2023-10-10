const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
const { file } = require('./utils/s3file.test');
const dotenv = require('dotenv');
dotenv.config();

chai.use(chaiHttp);

describe('register', ()=>{
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

    after(async () => {
      // MongoDB bağlantısını kapat
      await mongoose.connection.close().then(()=>{
        console.log("MongoDB bağlantısı kesildi!");
      });
    });

    afterEach(async function() {
      // Tüm verileri sil
      await mongoose.connection.db.dropDatabase();
    });

    it('should register a user successfully', function(done){
        
      const doctor = {
          name: 'DoctorName',
          surname: 'DoctorSurname',
          email: 'doctor4@example.com',
          password: 'doctorpassword',
          specialization: 'Cardiology',
          profilePhoto: file,
          iban: 'IBAN123',
          city: 'CityName',
          hospitalName: 'HospitalName',
      };

      console.log(file);
      chai.request(server)
      .post('/api/auth/signup')
      .query({ role: 'doctor'})
      .send(doctor)
      .end((err,res)=>{
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('Kullanıcı oluşturuldu!');
          done();
      });
    });    
    
    it('')
});

