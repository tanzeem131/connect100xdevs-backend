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
      const { status, toUserId } = req.params;
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

requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const isAllowedStatus = ["accepted", "rejected"];
      if (!isAllowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }
      console.log("Looking for connection request with ID:", requestId);
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
