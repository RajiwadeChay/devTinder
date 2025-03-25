const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is nor strong : " + value);
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18, // Field's min value
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid gender type",
      }, // To allow set values
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // }, // Custom validator function
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s", // Field's default value
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
      maxLength: 200,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, // Adding timestamps for create & update by deafult
  }
);

// Schema method to craete JWT Token
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });

  return token;
};

// Schema method to validate password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
