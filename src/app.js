const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello Test!");
});

app.use("/hello", (req, res) => {
  res.send("Hello Hello!");
});

app.use("/", (req, res) => {
  res.send("Hello Dashboard!");
});

app.listen(7777, () => {
  console.log("Server is listening to port 7777!");
});
