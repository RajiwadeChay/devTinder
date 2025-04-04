const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

// POST /payment/create API => To create order in razorpay
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    // Creating order in razorpay
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // in paisa
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    // Save order in database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    // Saving order in database
    const savedPayment = await payment.save();

    // Return order details to frontend
    res.json({
      message: "Order craeted successfully!",
      data: { ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ message: null, data: null, error: err.message });
  }
});

// POST /payment/webhook => To be call by razorpay
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body), // webhookBody
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET // webhookSecret
    );

    if (!isWebhookValid) {
      return res.status(400).json({
        message: null,
        data: null,
        error: "Webhook signature is invalid",
      });
    }

    // Update payment status in database
    const paymentDetails = req.body.payload.payment.entity;

    const paymnet = await Payment.findOne({ orderId: paymentDetails.order_id });
    paymnet.status = paymentDetails.status;
    await paymnet.save();

    // Update the user as premium
    const user = await User.findOne({ _id: paymnet.userId });
    user.isPremium = true;
    user.membershipType = paymnet.notes.membershipType;
    await user.save();

    // To perform specific task on status of payment
    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // Always return success response to razorpay else it will continue to send webhooks
    return res.status(200).json({
      message: "Webhook received successfully!",
      data: null,
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: null, data: null, error: err.message });
  }
});

// GET /premium/verify => To verify user is premium or not
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON();

    if (user.isPremium) {
      return res.json({
        message: "User is premium user",
        data: user,
        error: null,
      });
    }

    return res.json({
      message: "User is not premium user",
      data: user,
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: null, data: null, error: err.message });
  }
});

module.exports = paymentRouter;
