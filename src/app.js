const express = require("express");
const connectDB = require("./config/databse");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json()); // Using express.json moddleware to convert JSON => JS Obj

// POST /signup API
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // Validation of data
    validateSignUpData(req);

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10); // (pswdStr, saltRound) => saltRound => Number of encryption rounds

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // Getting dynamic data from API call

    await user.save(); // Saving user obj/document in DB
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// GET /user => Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    // Getting only one user matching email filter
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }

    // Getting all user matching email filter
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// GET /userById => Get user by id
app.get("/userById", async (req, res) => {
  const userId = req.body._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// GET /feed => Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // {} for getting all documents

    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// DELETE /user => Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("Deleted user successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// UPDATE /user => Update a user by id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    // DATA SANITIZATION
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed!");
    }

    // Skills field validation
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true, // Enabling custome validator function
    });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    res.status(400).send("UPDATE FAILED : " + err.message);
  }
});

// UPDATE /userByEmail => Update a user by email
app.patch("/userByEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      returnDocument: "after",
    });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully by email");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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
