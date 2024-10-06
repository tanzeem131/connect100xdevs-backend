const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", UserAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + "send the connections request");
});

module.exports = requestRouter;
