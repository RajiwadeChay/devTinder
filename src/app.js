const express = require("express");
const connectDB = require("./config/databse");
const User = require("./models/user");

const app = express();

app.use(express.json()); // Using express.json moddleware to convert JSON => JS Obj

// POST /signup API
app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body); // Getting dynamic data from API call

  try {
    await user.save(); // Saving user obj/document in DB
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Unable to add user : " + err.message);
  }
});

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
