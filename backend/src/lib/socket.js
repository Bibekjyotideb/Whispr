import { Server } from "socket.io";
import http from "http";

export function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: true,  // same origin allowed, no external frontend server needed
      credentials: true,
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Assuming userId sent via query params on socket connection
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return server;
}
