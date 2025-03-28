const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      // throw new Error("Invalid Token!!");
      return res
        .status(401)
        .json({ message: null, data: null, error: "Please Sign In!" });
    }

    // Verifying token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    // Finding user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found!");
    }

    req.user = user; // Attaching user to req
    next();
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
};

module.exports = {
  userAuth,
};
