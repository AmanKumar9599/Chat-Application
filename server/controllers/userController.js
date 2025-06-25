const bcrypt = require("bcryptjs");
const {generateToken} = require('../utils/token')
const User = require("../models/User");
const cloudinaryConnect = require('../config/cloudinary')


// signup a new user
exports.signup = async (req,res)=>{
    const{email,fullName,bio,password}=req.body;
    try{
        if(!fullName || !email || !password || !bio){
            return res.status(400).json({
                success:false,
                message:"missing details"
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({
                success:false,
                message:"Account already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await User.create({email,fullName,password:hashedPassword,bio});
        // const options =({
        //     expires: new Date(Date.now()+ 7 * 24 *60*60*1000),
        //     httpOnly:true
        // });

        const token = generateToken(newUser._id);
        // res.cookie("token",token,options).status(200).json({
        //     success:true,
        //     data:token,userData,
        //     message:"User logged in successfully"
        // })
        return res.status(201).json({
            success:true,
            userData:newUser,token,
            message:"user created successfully"
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
}



// login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "Please register first",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(userData._id);

        return res.status(201).json({
            success: true,
            token,
            userData,
            message: "User logged in successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



// user is authenticated or not

exports.checkAuth = (req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user,
        message:"User is authenticated"
    })
}

// update profile
const cloudinary = require('../config/cloudinary');

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing fullName"
      });
    }

    let updatedData = { fullName, bio };

    // 🛠️ New part: check if profilePic is base64
    if (profilePic && profilePic.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "profilePics"
      });
      updatedData.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
