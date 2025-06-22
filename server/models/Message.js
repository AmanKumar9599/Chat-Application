const mongooose = require("mongoose")

const messageSchema = new mongooose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        
    },
    image:{
        type:String,
        
    },
    seen:{
        type:Boolean,
        default:false
    },
    
},
{timestamps:true}
)

module.exports = mongooose.model("Message",messageSchema);