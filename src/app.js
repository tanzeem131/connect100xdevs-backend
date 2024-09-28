const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Tanzeem", Age: "22" });
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved in database");
});

app.delete("/user", (req, res) => {
  res.send("Data is deleted successfully");
});

//"use" will call for every method(get,post,put etc)
app.use("/test", (req, res) => {
  res.send("Hello from server:Testpage");
});

app.listen(4000, () => {
  console.log("server is running on port:4000");
});
