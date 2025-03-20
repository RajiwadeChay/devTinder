const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, // Getting ObjectId type from mongoose
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is invalid status type",
      },
    }, // enum for set of accepted values with custom error message
  },
  {
    timestamps: true,
  }
);

// Creating compound indexes for this schema
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Validating if fromUserId is same as toUserId
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }

  next(); // Always call
}); // This pre function will always runs before save()

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
