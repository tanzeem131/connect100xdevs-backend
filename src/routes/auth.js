const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const { getCommitCountForYearGraphQL } = require("../utils/validation");

authRouter.post("/signup", async (req, res, next) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, githubUsername, password } = req.body;

    if (!githubUsername) {
      throw new Error("GitHub username is required.");
    }

    const currentYear = 2024;
    const totalCommits = await getCommitCountForYearGraphQL(
      githubUsername,
      currentYear
    );

    if (!totalCommits && totalCommits !== 0) {
      throw new Error(
        "Unable to fetch commit data from GitHub. Please try again."
      );
    }

    if (totalCommits <= 50) {
      throw new Error(
        `GitHub account does not meet the required minimum of 50 commits. Current commits: ${totalCommits}`
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      githubUsername,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(201)
      .json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    // next(err);
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successfully");
});

module.exports = authRouter;
