const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const { DB_URL } = process.env;
    await mongoose.connect(DB_URL);
  } catch (err) {
    console.log("Error: " + err.message);
  }
};

module.exports = {
  connectDB,
};
