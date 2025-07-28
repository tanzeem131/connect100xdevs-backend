/*
const bcrypt = require("bcrypt");
const User = require("../models/user");
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
// const { getCommitCountForYearGraphQL } = require("../utils/validation");

authRouter.post("/signup", async (req, res, next) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, githubUsername, password } = req.body;

    if (!githubUsername) {
      throw new Error("GitHub username is required.");
    }

    // const currentYear = 2024;
    // const totalCommits = await getCommitCountForYearGraphQL(
    //   githubUsername,
    //   currentYear
    // );

    // if (!totalCommits && totalCommits !== 0) {
    //   throw new Error(
    //     "Unable to fetch commit data from GitHub. Please try again."
    //   );
    // }

    // if (totalCommits <= 50) {
    //   throw new Error(
    //     `GitHub account does not meet the required minimum of 50 commits. Current commits: ${totalCommits}`
    //   );
    // }

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
*/

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

//Login with github
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const axios = require("axios");

authRouter.get("/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

authRouter.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res
      .status(400)
      .json({ success: false, message: "Authorization code not provided." });
  }

  try {
    // 1. Exchange the code for an access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve access token." });
    }

    // 2. Use the access token to get user's profile info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}` },
    });

    const {
      id: githubId,
      name,
      email: githubEmail,
      avatar_url,
      login: githubUsername,
    } = userResponse.data;

    // 3. Get user's primary email if not public
    let primaryEmail = githubEmail;
    if (!primaryEmail) {
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `token ${access_token}` },
        }
      );
      const primary = emailsResponse.data.find((e) => e.primary && e.verified);
      primaryEmail = primary ? primary.email : null;
    }

    if (!primaryEmail) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve a verified primary email from GitHub.",
      });
    }

    // 4. Find or create a user in your database
    let user = await User.findOne({ emailId: primaryEmail });

    if (!user) {
      user = await User.findOne({ githubId: githubId });
    }

    const nameParts = name ? name.split(" ") : [];
    const firstName = nameParts[0] || githubUsername;
    const lastName = nameParts.slice(1).join(" ") || "";

    if (user) {
      user.githubId = user.githubId || githubId;
      user.githubUsername = user.githubUsername || githubUsername;
      user.photoUrl =
        user.photoUrl === "https://geographyandyou.com/images/user-profile.png"
          ? avatar_url
          : user.photoUrl;
      user.isVerified = true;

      await user.save();
    } else {
      user = new User({
        firstName: firstName,
        lastName: lastName,
        emailId: primaryEmail,
        githubId: githubId,
        githubUsername: githubUsername,
        photoUrl: avatar_url,
        isVerified: true,
      });
      await user.save();
    }

    // 5. Generate JWT token
    const token = await user.getJWT();

    // 6. Set token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // 7. Redirect to frontend
    if (process.env.NODE_ENV === "production") {
      res.redirect(process.env.CLIENT_URL);
    } else {
      res.redirect("http://localhost:5173");
    }
  } catch (error) {
    console.error(
      "GitHub auth error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal server error during GitHub authentication.",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successfully");
});

module.exports = authRouter;
