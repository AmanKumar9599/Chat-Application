const cloudinaryConnect = require("../config/cloudinary")
const User = require("../models/User");
const Message = require("../models/Message");
const {io,userSocketMap} = require("../server")


// get all user except logged in user
exports.getUserForSidebar = async (req, res) => {
	try {
		const userId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

		// count no. of unseen messages
		const unseenMessages = {};
		const promises = filteredUsers.map(async (user) => {
			const messages = await Message.find({
				senderId: user._id,
				receiverId: userId,
				seen: false,
			});
			if (messages.length > 0) {
				unseenMessages[user._id] = messages.length;
			}
		});
		await Promise.all(promises);

		res.status(200).json({
			success: true,
			users: filteredUsers,
			unseenMessages,
			messsge: "Users and unseen messages fetched successfully",
		});
	} catch (err) {
		console.log(err.message);
		res.json({ success: false, message: err.message });
	}
};

// get all message for selected user
exports.getMessages = async (req, res) => {
	try {
		const { id: selectedUserId } = req.params;
		const myId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: myId, receiverId: selectedUserId },
				{ senderId: selectedUserId, receiverId: myId },
			],
		});

		await Message.updateMany(
			{ senderId: selectedUserId, receiverId: myId },
			{ seen: true }
		);

		res.json({ success: true, messages });
	} catch (err) {
		console.log(err.message);
		res.json({
			success: false,
			message: err.message,
		});
	}
};

// to mark message as seen
exports.markMessageAsSeen = async (req, res) => {
	try {
		const { id } = req.params;
		await Message.findByIdAndUpdate(id, { seen: true });
		res.json({ success: true });
	} catch (err) {
		console.log(err.message);
		res.json({
			success: false,
			message: err.message,
		});
	}
};


// send message to selected User

exports.sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinaryConnect.uploader(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        // emit the new message to the receiver's socket
        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.json({
            success:true,
            newMessage
        });
    }
    catch(err){
        console.log(err.message);
		res.json({
			success: false,
			message: err.message,
		});
    }
}