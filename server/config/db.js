const mongooose = require("mongoose");
require("dotenv").config();

const URI = process.env.URI;

const connectDB = async()=>{
    try{
        await mongooose.connect(URI);
        console.log("DB connected successfully");
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = connectDB;


// const mongoose = require('mongoose');
// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/chatApp", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.log("❌ MongoDB Connection Error:", err.message);
//   }
// };

// module.exports = connectDB;
