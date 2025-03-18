const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is invalid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }
};

const validateEditProfileData = (req) => {
  const { photoUrl, about, skills } = req.body;

  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
  ];

  if (!validator.isURL(photoUrl)) {
    throw new Error("Photo url is invalid!");
  } else if (!about) {
    throw new Error("About is invalid!");
  } else if (skills.length == 0) {
    throw new Error("Add alteast 1 skill!");
  }

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateEditPasswordData = async (req) => {
  const { password } = req.body;
  const signedInUser = req.user;

  const isPasswordSame = await bcrypt.compare(password, signedInUser.password);

  if (isPasswordSame) {
    throw new Error("Enter a new password!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPasswordData,
};
