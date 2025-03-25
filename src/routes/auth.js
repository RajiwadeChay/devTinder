const express = require("express");
const authRouter = express.Router(); // Creating Router

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

// POST /signup API
authRouter.post("/signup", async (req, res) => {
  try {
    // const {
    //   firstName,
    //   lastName,
    //   emailId,
    //   password,
    //   age,
    //   gender,
    //   photoUrl,
    //   about,
    //   skills,
    // } = req.body;
    const firstName = req?.body?.firstName;
    const lastName = req?.body?.lastName;
    const emailId = req?.body?.emailId;
    const password = req?.body?.password;
    const age = req?.body?.age;
    const gender = req?.body?.gender;
    const photoUrl =
      req?.body?.photoUrl ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s";
    const about = req?.body?.about || "This is user default about text";
    const skills = req?.body?.skills || [];

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
      age,
      gender,
      photoUrl,
      about,
      skills,
    }); // Getting dynamic data from API call

    const savedUser = await user.save(); // Saving user obj/document in DB

    // Craeting a JWT token
    const token = await user.getJWT(); // jwt.sigin(infoToHide, secreteKey, {expiryDate});

    // Add token to cookie and send back to user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 days
    }); // res.cookie(tokenName, token, expiryDate)

    res.json({
      message: "User added successfully!",
      data: savedUser,
      error: null,
    });
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
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

      res.json({ message: "Sign In Successful!", data: user, error: null });
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
});

// POST /signout API
authRouter.post("/signout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  }); // setting token as null, expriring token now

  res.json({ message: "Sign Out Successful!", data: null, error: null });
});

module.exports = authRouter;
