const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      // throw new Error("Invalid Token!!");
      return res
        .status(401)
        .json({ message: null, error: "Please Sign In!", data: null });
    }

    // Verifying token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedObj;

    // Finding user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found!");
    }

    req.user = user; // Attaching user to req
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  userAuth,
};
