const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// GET /user/requests/received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const signedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: signedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    ); // populate => Getting req data from User using fromUserId as ref, populate(ref, fieldsReq);, can pass ["age","gender"] or "age gender"
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data Fetched Successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
