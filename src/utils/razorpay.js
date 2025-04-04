const Razorpay = require("razorpay");

// Initialize razor pay instance get ID & Secret from razorpay dashboard
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;
