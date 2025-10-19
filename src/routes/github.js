const express = require("express");
const githubRouter = express.Router();
const axios = require("axios");
const { githubLimiter } = require("../middlewares/rateLimiter");

const GITHUB_TOKEN = process.env.YOUR_GITHUB_TOKEN;

githubRouter.get("/github-stats/:username", githubLimiter, async (req, res) => {
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
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch GitHub stats" });
  }
});

// New route for language statistics
githubRouter.get(
  "/github-languages/:username",
  githubLimiter,
  async (req, res) => {
    const { username } = req.params;
    try {
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      const repos = reposRes.data;

      const ownRepos = repos.filter((repo) => !repo.fork);

      const languagePromises = ownRepos.map((repo) =>
        axios
          .get(repo.languages_url, {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
          })
          .then((res) => res.data)
          .catch(() => ({}))
      );

      const repoLanguages = await Promise.all(languagePromises);

      // Languages to exclude
      const excludeLanguages = [
        "Handlebars",
        "EJS",
        "Pug",
        "Mustache",
        "Nunjucks",
        "Twig",
        "JSON",
        "YAML",
        "TOML",
        "XML",
        "Markdown",
        "Text",
        "reStructuredText",
        "Dockerfile",
        "Makefile",
        "CMake",
        "Shell",
        "Batchfile",
        "PowerShell",
        "Procfile",
        "Vim Script",
        "Emacs Lisp",
      ];

      const langCount = {};
      repoLanguages.forEach((langObj) => {
        Object.keys(langObj).forEach((lang) => {
          if (!excludeLanguages.includes(lang)) {
            langCount[lang] = (langCount[lang] || 0) + 1;
          }
        });
      });

      const sortedLangs = Object.entries(langCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      res.json(sortedLangs);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch language stats" });
    }
  }
);

module.exports = githubRouter;
