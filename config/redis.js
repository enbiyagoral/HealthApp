const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("error",(err)=>{
    console.log("Redis Client Error: ", err);
});

client.connect().then(()=>{
    console.log("Redis Client Connected");
})



module.exports = { client };
