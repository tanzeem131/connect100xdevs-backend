const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        message: [],
      });
    }
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.log(error);
  }
});

chatRouter.get("/chat/conversations", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "firstName lastName photoUrl age gender")
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherUser = chat.participants.find(
        (participant) => participant._id.toString() !== userId.toString()
      );
      return {
        _id: chat._id,
        otherUser,
        message: chat.message,
        updatedAt: chat.updatedAt,
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

module.exports = chatRouter;
