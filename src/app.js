const express = require("express");
const connectDB = require("./config/databse");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json()); // Using express.json moddleware to convert JSON => JS Obj
app.use(cookieParser()); // For parsing (reading) cookies

// Importing different API routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

// Configuring API routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...!");
    app.listen(7777, () => {
      console.log("Server is listening to port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database connection not established...!");
  });
