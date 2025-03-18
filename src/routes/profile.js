const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  validateEditPasswordData,
} = require("../utils/validation");

// GET /profile/view => Get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// PATCH /profile/edit => Update profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const signedInUser = req.user;

    Object.keys(req.body).forEach((key) => (signedInUser[key] = req.body[key]));

    await signedInUser.save();

    res.json({
      message: `${signedInUser.firstName}, your profile updated successfully!`,
      data: signedInUser,
    }); // Best Practice
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// PATCH /profile/password => Update password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const signedInUser = req.user;

    await validateEditPasswordData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    signedInUser.password = passwordHash;

    await signedInUser.save();

    res.json({
      message: `${signedInUser.firstName}, your password updated successfully!`,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
