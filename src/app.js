const express = require("express");
const connectDB = require("./config/databse");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./utils/cronjobs");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Whitelisting Frontend Origin
    credentials: true,
  })
); // Resolving CORS Issue
app.use(express.json()); // Using express.json moddleware to convert JSON => JS Obj
app.use(cookieParser()); // For parsing (reading) cookies

// Importing different API routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

// Configuring API routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...!");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening to port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database connection not established...!");
  });
