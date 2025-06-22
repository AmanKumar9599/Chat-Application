const mongooose = require("mongoose")

const userSchema = new mongooose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String
    }
},
{timestamps:true}
)

module.exports = mongooose.model("User",userSchema);