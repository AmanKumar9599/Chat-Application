const express = require("express");
const { auth } = require("../middleware/auth");
const { updateProfile, checkAuth,login, signup } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",auth,updateProfile);
userRouter.get("/check",auth,checkAuth)

export default userRouter;