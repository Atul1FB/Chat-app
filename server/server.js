// backend/index.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/routes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();

// Use http server for Socket.io
const server = http.createServer(app);

// --------------------------
// Initialize Socket.io
// --------------------------
export const io = new Server(server, {
  cors: { origin: "*" }, // allow all origins (safe for dev)
});

// Store online users: { userId: socketId }
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // consistent event name
  });
});

// --------------------------
// Middleware
// --------------------------
app.use(express.json({ limit: "4mb" }));

// CORS setup for React dev server on LAN
app.use(
  cors({
    origin: [ "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.43.180:5173"], // 
    credentials: true,
  })
);

// --------------------------
// Routes
// --------------------------
app.get("/api/status", (req, res) => {
  res.send("Server is live! ✅");
});

app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

// --------------------------
// Connect to MongoDB
// --------------------------
await connectDb();

// --------------------------
// Start server (LAN-ready)
// --------------------------
if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT: ${PORT} and accessible in LAN`);
});

}

// Exporting server for vercel
export default server