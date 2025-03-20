const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

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
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.messgae);
  }
});

module.exports = userRouter;
