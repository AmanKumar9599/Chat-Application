const mongooose = require("mongoose");
require("dotenv").config();

const URI = process.env.URI;

const connectDB = async()=>{
    try{
        await mongooose.connect(URI);
        console.log("DB connected successfully");
    }
    catch(err){
        clg(err);
    }
}

module.exports = connectDB;