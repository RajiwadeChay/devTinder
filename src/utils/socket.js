const socket = require("socket.io");
const crypto = require("crypto");

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
      ({ firstName, userId, targetUserId, text, photoUrl }) => {
        // Creating unique room id
        const roomId = getSecretRoomId(userId, targetUserId);
        // console.log(firstName + " Sent Message : " + text);
        // Sending message to room
        io.to(roomId).emit("messageReceived", {
          userId,
          firstName,
          text,
          photoUrl,
        });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
