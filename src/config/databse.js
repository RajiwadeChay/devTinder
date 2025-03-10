const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:6EZeQIoe0l529ice@namastenode.y2gyv.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
