const express = require("express");
const { auth } = require("../middleware/auth");
const {
	getUserForSidebar,
	getMessages,
	markMessageAsSeen,
} = require("../controllers/messageController");

const messageRouter = express.Router();
messageRouter.get("/users", auth, getUserForSidebar);
messageRouter.get("/:id", auth, getMessages);
messageRouter.put("/mark/:id", auth, markMessageAsSeen);


module.exports = messageRouter;
