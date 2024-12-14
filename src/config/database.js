const mongoose = require("mongoose");
require("dotenv").config();
const DB_URL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
  } catch (err) {
    console.log("Error: " + err.message);
  }
};

module.exports = {
  connectDB,
};
