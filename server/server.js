const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://rolesphere-web-int-frontend.onrender.com", // replace with actual frontend URL
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle incoming chat message
  socket.on("chatMessage", ({ roomId, message, user }) => {
    const messageData = {
      message,
      user,
      id: socket.id, // identify sender
    };
    io.to(roomId).emit("chatMessage", messageData);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
