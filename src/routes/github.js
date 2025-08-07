const express = require("express");
const githubRouter = express.Router();
const axios = require("axios");

const GITHUB_TOKEN = process.env.YOUR_GITHUB_TOKEN;

githubRouter.get("/github-stats/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    // const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`, { headers: {...} });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch GitHub stats" });
  }
});

module.exports = githubRouter;
