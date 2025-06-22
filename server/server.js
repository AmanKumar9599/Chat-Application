const express = require("express");
const app=express();
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(cookieParser())



app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
  });

const PORT =process.env.PORT||5000;

app.listen(PORT,()=> console.log(`server is running on port ${PORT}`));
connectDB();