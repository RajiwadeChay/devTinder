const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked!");
  // Logic for auth check
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized user!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting checked!");
  // Logic for auth check
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized user!");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
