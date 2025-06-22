const User = require("../models/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token not found "
            })
        }
        try{
            const decode = await jwt.verify(token,process.env(JWT_SECRET));
            console.log(decode);
            const user = await User.findById(decoded.userId).select("-password");
            req.user=user;
        }
        catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}
        next();
    }
    catch(err){
        return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
    }

} 


