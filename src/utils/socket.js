const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

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
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ userId, targetUserId, optimizedMessage }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          const checkStatus = await ConnectionRequest.findOne({
            $or: [
              {
                toUserId: userId,
                fromUserId: targetUserId,
                status: "accepted",
              },
              {
                toUserId: targetUserId,
                fromUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (checkStatus) {
            let chat = await Chat.findOne({
              participants: { $all: [userId, targetUserId] },
            });
            if (!chat) {
              chat = new Chat({
                participants: [userId, targetUserId],
                message: [],
              });
            }

            chat.message.push({
              senderId: userId,
              text: optimizedMessage,
            });

            await chat.save();
          }

          io.to(roomId).emit("messageReceived", {
            text: optimizedMessage,
            createdAt: new Date(),
            senderId: userId,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
