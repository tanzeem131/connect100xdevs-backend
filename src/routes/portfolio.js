const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Portfolio = require("../models/portfolioDetails");
const portfolioRouter = express.Router();

portfolioRouter.post("/portfolio/save", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioData = req.body;

    if (portfolioData.socials) {
      portfolioData.socials.github = req.user.githubUsername;
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { ...portfolioData, user: userId, slug: req.user.githubUsername },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Portfolio saved successfully!",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving portfolio: " + error.message });
  }
});

portfolioRouter.get("/portfolio/:githubUsername", async (req, res) => {
  try {
    const { githubUsername } = req.params;

    const portfolioDetails = await Portfolio.findOne({ slug: githubUsername });

    if (!portfolioDetails) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    res.status(200).json({
      message: "Portfolio details fetched successfully!",
      portfolio: portfolioDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching portfolio details: " + error.message,
    });
  }
});

module.exports = portfolioRouter;
