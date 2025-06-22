const bcrypt = require("bcryptjs");


// signup a new user
import User from "../models/User";
import { generateToken } from "../utils/token";

export const signup = async (req,res)=>{
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
        const hashedPassword=bcrypt.hash(password,salt);
        const newUser = await User.create({email,fullName,password:hashedPassword,bio});
        const token = generateToken(newUser._id);
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

export const login = async(req,res)=>{
    try{
        const{email,password}=req.body;
        const userData = await User.findOne({email});
        if(!userData){
            res.status(400).json({
                success:false,
                message:"Please registerd first"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password,userData.password);
        if(!isPasswordCorrect){
            res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });
        }

        const options =({
            expires: new Date(Date.now()+ 7 * 24 *60*60*1000),
            httpOnly:true
        });

        const token = generateToken(newUser._id);
        res.cookie("token",token,options).status(200).json({
            success:true,
            data:token,userData,
            message:"User logged in successfully"
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
     
}