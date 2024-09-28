const express = require("express");
const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("handling the route 1");
    next();
  },
  (req, res, next) => {
    console.log("handling the route 2");
    // res.send("Response from Route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("handling the route 3");
    // res.send("Response from Route handler 3");
    next();
  },
  (req, res) => {
    console.log("handling the route 4");
    res.send("Response from Route handler 4");
  }
);

app.listen(4000, () => {
  console.log("server is running on port:4000");
});
