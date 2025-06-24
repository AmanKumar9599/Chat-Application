const User = require("../models/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("🔍 Received token from client:", token);

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("🔓 Decoded JWT:", decoded);

            const user = await User.findById(decoded.userId).select("-password");
            req.user = user;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};
