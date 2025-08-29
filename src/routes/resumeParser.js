const express = require("express");
const resumeParserRouter = express.Router();
const axios = require("axios");
const { prompt } = require("./../utils/constants");
const { resumeParcerLimiter } = require("../middlewares/rateLimiter");
const { UserAuth } = require("../middlewares/auth");

resumeParserRouter.post(
  "/resume-parser",
  UserAuth,
  resumeParcerLimiter,
  async (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "resumeText is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return res
        .status(500)
        .json({ error: "Server configuration error: Missing API key." });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Build the final prompt
    const finalPrompt = `${prompt}\n\n--- RESUME TEXT ---\n${resumeText}\n--- END RESUME TEXT ---`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          contents: [{ parts: [{ text: finalPrompt }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const rawJsonString =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJsonString) {
        return res
          .status(500)
          .json({ error: "AI model returned empty response." });
      }

      const cleanedJsonString = rawJsonString
        .replace(/```json\n?|```/g, "")
        .trim();

      let structuredData;
      try {
        structuredData = JSON.parse(cleanedJsonString);
      } catch (err) {
        console.error("Failed to parse AI JSON:", cleanedJsonString);
        return res
          .status(500)
          .json({ error: "Invalid JSON returned from AI." });
      }
      return res.status(200).json(structuredData);
    } catch (error) {
      console.error(
        "Error parsing resume with AI:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "An internal server error occurred while parsing the resume.",
      });
    }
  }
);

module.exports = resumeParserRouter;
