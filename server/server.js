const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/UserRoutes");
const MessageRouter = require("./routes/MessageRoutes");

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true, // if you are using cookies
}));

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", MessageRouter);

app.get("/", (req, res) => {
	res.send("Hello from Express!");
});

const http = require("http");
const server = http.createServer(app);

// 👉 socket.io setup
const { Server } = require("socket.io");

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	console.log("User connected", userId);

	if (userId) userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("User disconnected", userId);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
