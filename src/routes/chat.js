const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

// GET /chat/:targetUserId => To get chats
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.params;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    // If chat is empty creating new empty chat
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    return res.json({
      message: "Chat fetched successfully!",
      data: chat,
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: null, data: null, error: err.message });
  }
});

module.exports = chatRouter;
