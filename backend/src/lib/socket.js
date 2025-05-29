import { Server } from "socket.io";
import http from "http";

const userSocketMap = {};

let io; // will be set in setupSocket

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

function setupSocket(app) {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Use handshake.auth or handshake.query depending on your frontend
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return server;
}

// NAMED function to export
function ioFunc() {
  return io;
}

export { setupSocket, getReceiverSocketId, ioFunc as io };
