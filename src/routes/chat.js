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

module.exports = chatRouter;
