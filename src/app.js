const express = require("express");
const app = express();
app.use("/", (req, res) => {
  res.send("Hello from server:Dashboard");
});
app.use("/test", (req, res) => {
  res.send("Hello from server:Testpage");
});
app.use("/hello", (req, res) => {
  res.send("Hello Hello Hello:HelloPage");
});
app.listen(4000, () => {
  console.log("server is running on port:4000");
});
