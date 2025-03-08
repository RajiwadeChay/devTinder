const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("1st Response Handler");
    // res.send("1st Response!");
    next();
  },
  [
    (req, res, next) => {
      console.log("2nd Response Handler");
      // res.send("2nd Response!");
      next();
    },
    (req, res, next) => {
      console.log("3rd Response Handler");
      // res.send("3rd Response!");
      next();
    },
    (req, res, next) => {
      console.log("4th Response Handler");
      // res.send("4th Response!");
      next();
    },
  ],
  (req, res, next) => {
    console.log("5th Response Handler");
    res.send("5th Response!");
    // next();
  }
);

app.listen(7777, () => {
  console.log("Server is listening to port 7777!");
});
