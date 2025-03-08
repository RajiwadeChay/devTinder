const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.get("/getUserData", (req, res) => {
  try {
    // Logic for DB call
    throw new Error("Error!");
    res.send("User Data Sent");
  } catch (err) {
    res.status(500).send("Some Error, Connect to support team!");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(7777, () => {
  console.log("Server is listening to port 7777!");
});
