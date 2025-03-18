const express = require("express");
const authRouter = express.Router(); // Creating Router

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

// POST /signup API
authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

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
      gender,
      photoUrl,
      about,
      skills,
    }); // Getting dynamic data from API call

    await user.save(); // Saving user obj/document in DB
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// POST /signin API
authRouter.post("/signin", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Craeting a JWT token
      const token = await user.getJWT(); // jwt.sigin(infoToHide, secreteKey, {expiryDate});

      // Add token to cookie and send back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 days
      }); // res.cookie(tokenName, token, expiryDate)

      res.send("Sign In Successful!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// POST /signout API
authRouter.post("/signout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  }); // setting token as null, expriring token now

  res.send("Sign Out Successful!");
});

module.exports = authRouter;
