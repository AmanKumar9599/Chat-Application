


const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/UserRoutes");
const messageRouter = require("./routes/MessageRoutes");
const http = require("http");
const server = http.createServer(app);
const { initSocket } = require("./socket"); // ✅ new import

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// DB Connect
connectDB();

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start Socket
initSocket(server); // ✅ Initialize socket with server

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
