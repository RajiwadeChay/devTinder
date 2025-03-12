const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Makes field mandatory
      minLength: 4, // Min field length
      maxLength: 50, // Max field length
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // Makes field unique
      trim: true, // Trims field input
      lowercase: true, // Convert field input to lowercase
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 8,
    },
    age: {
      type: Number,
      min: 18, // Field's min value
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      }, // Custom validator function
    },
    photoUrl: {
      type: String,
      default: "https://www.freepik.com/free-photos-vectors/default-user", // Field's default value
    },
    about: {
      type: String,
      default: "This is user default about text",
      minLength: 4,
      maxLength: 50,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, // Adding timestamps for create & update by deafult
  }
);

module.exports = mongoose.model("User", userSchema);
