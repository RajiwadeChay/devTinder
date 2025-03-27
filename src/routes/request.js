const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// POST /request/send/:status/:userId
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      console.log(
        "CREDS : ",
        process.env.AWS_ACCESS_KEY,
        process.env.AWS_SECRET_KEY
      );
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Validating status type
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: null,
          data: null,
          error: "Invalid status type : " + status,
        });
      }

      // Validating toUser exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({ message: null, data: null, error: "User Not Found!" });
      }

      // Validating connection request already exists or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: null,
          data: null,
          error: "Connection Request Already Exists!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      console.log("DATA SAVE REACHED");

      const emailRes = await sendEmail.run(
        `You got a new request from ${req.user.firstName}`,
        `${req.user.firstName} is ${status} in ${toUser.firstName}`
      );

      console.log("emailRes : ", emailRes);

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
        error: null,
      });
    } catch (err) {
      res.status(400).json({ message: null, data: null, error: err.message });
    }
  }
);

// POST /request/review/:status/:requestId
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const signedInUser = req.user;
      const { status, requestId } = req.params;

      // Validating connection req status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: null,
          data: null,
          error: "Invalid status type : " + status,
        });
      }

      // Validating requestId, toUserId === signedInUserId, status === "interested"
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: signedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: null,
          data: null,
          error: "Connetion Request Not Found!",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Connection request is ${status}!`,
        data,
        error: null,
      });
    } catch (err) {
      res.status(400).json({ message: null, data: null, error: err.message });
    }
  }
);

module.exports = requestRouter;
