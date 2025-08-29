const express = require("express");
const profileRouter = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const { profileSaveLimiter } = require("../middlewares/rateLimiter");

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch(
  "/profile/edit",
  UserAuth,
  profileSaveLimiter,
  async (req, res) => {
    try {
      if (!validateEditProfile(req)) {
        throw new Error("Invalid credentials");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );
      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName},your profile updated successfully`,
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = profileRouter;
