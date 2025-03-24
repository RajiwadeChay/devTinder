const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// GET /user/requests/received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const signedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: signedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // populate => Getting req data from User using fromUserId as ref, populate(ref, fieldsReq);, can pass ["age","gender"] or "age gender"
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data Fetched Successfully!",
      data: connectionRequests,
      error: null,
    });
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
});

// GET /user/connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const signedInUser = req.user;

    // Fiding connection where signedInUserId should present in fromUserId or toUserId
    const connectionsRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: signedInUser._id, status: "accepted" },
        { fromUserId: signedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Filtering data to only get connected users data
    const data = connectionsRequests.map((row) => {
      if (row.fromUserId._id.toString() === signedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ message: null, data, error: null });
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
});

// GET /user/feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const signedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Pseudo Logic =>
    // Get all users whos
    // _id !=== signedInUser._id
    // not present in user's connections

    // Geting all connections of signedInUser
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: signedInUser._id }, { toUserId: signedInUser._id }],
    }).select("fromUserId toUserId");

    // Filter users to hide from feed
    const hideUersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUersFromFeed.add(req.fromUserId.toString());
      hideUersFromFeed.add(req.toUserId.toString());
    });

    // Filtering & Getting users based on conditions
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUersFromFeed) } },
        { _id: { $ne: signedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit); // With pagination

    res.json({ message: null, data: users, error: null });
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
});

module.exports = userRouter;
