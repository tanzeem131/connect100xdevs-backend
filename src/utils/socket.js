const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("joining room with id: ", roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ userId, targetUserId, newMessage }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      io.to(roomId).emit("messageReceived", { newMessage });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
