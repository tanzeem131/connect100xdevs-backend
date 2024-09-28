const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "John",
    lastName: "wick",
    emailId: "john@gmail.com",
    age: 32,
    password: "zxbbsj1",
    gender: "male",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(4000, () => {
      console.log("server is running on port:4000");
    });
  })
  .catch((err) => {
    console.log("Database connection not established");
  });
