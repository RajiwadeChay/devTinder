const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent.");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("Deleted user.");
});

app.get("/user/login", (req, res) => {
  res.send("User Login.");
});

app.use("/user", userAuth);

app.get("/user/userData", (req, res) => {
  res.send("User Data Sent.");
});

app.listen(7777, () => {
  console.log("Server is listening to port 7777!");
});
