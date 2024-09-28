const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  //1st way- error handling try catch method
  try {
    throw new Error("ajnsjjdnjd");
    res.send("User data sent");
  } catch (err) {
    res.status(500).send("Something went wrong!!!");
  }
});

//2nd way -error handling
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something went wrong!!!111");
//   }
// });

app.listen(4000, () => {
  console.log("server is running on port:4000");
});
