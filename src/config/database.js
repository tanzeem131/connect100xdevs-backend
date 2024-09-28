const mongoose = require("mongoose");

const URI =
  "mongodb+srv://NodeProject:QFl14Loik3Bt8fdB@tinder4devs.9cecd.mongodb.net/";

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = {
  connectDB,
};
