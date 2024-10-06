const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid request");
      }
      const existingConnnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists!!",
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      const sendMessage =
        status === "ignored"
          ? `${req.user.firstName} ignored ${toUser.firstName}`
          : `${req.user.firstName} send the interest to ${toUser.firstName}`;

      res.json({
        sendMessage,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
