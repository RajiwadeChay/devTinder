const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Inavlid Email : " + value);
        }
      }, // Custom validation function using validator package
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is nor strong : " + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Inavlid URL : " + value);
        }
      },
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
