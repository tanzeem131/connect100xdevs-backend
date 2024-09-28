const express = require("express");
const app = express();

const { AdminAuth, UserAuth } = require("./middlewares/AdminAuth");

app.use("/admin", AdminAuth);

app.get("/user", UserAuth, (req, res) => {
  res.send("User data sent");
});
app.get("/admin/getAllData", (req, res) => {
  //Logic to check user is authorized or not
  res.send("All data sent");
});
app.get("/admin/deleteUser", (req, res) => {
  //Logic to check user is authorized or not
  res.send("Deleted a User");
});

app.listen(4000, () => {
  console.log("server is running on port:4000");
});
