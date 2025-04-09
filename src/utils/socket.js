const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

// Createing secret has room id
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  // Creating socket
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  }); // socket(server, serverConfig)

  // Establishing connection & handling events
  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // Creating unique room id
      const roomId = getSecretRoomId(userId, targetUserId);
      //   console.log(firstName + " Joining Room : " + roomId);
      // Creating unique room
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text, photoUrl }) => {
        // Save messages to the database
        try {
          // Creating unique room id
          const roomId = getSecretRoomId(userId, targetUserId);
          // console.log(firstName + " Sent Message : " + text);

          // Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }, // Finding for all elements of array
          });

          // If chat is empty creating new empty chat
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // If chat exists push messages to chat
          chat.messages.push({
            senderId: userId,
            text,
          });

          // Saving chat
          await chat.save();

          // Sending message to room
          io.to(roomId).emit("messageReceived", {
            userId,
            firstName,
            lastName,
            text,
            photoUrl,
          });
        } catch (err) {
          console.log("ERROR : " + err?.message);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
