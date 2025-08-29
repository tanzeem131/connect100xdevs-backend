const rateLimit = require("express-rate-limit");

const resumeParcerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    error: "Too many resume parsing requests",
    message: "Please try again after 15 minutes",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message:
        "Too many resume parsing requests. Please try again after 15 minutes.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },

  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

const profileSaveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,

  keyGenerator: (req) => {
    return `user:${req.user.id}`;
  },

  message: {
    error: "Too many profile update requests",
    message: "Please try again after 5 minutes",
    retryAfter: 5 * 60,
  },

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message:
        "Too many profile update requests. Please try again after 5 minutes.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },

  skipFailedRequests: true,
  skipSuccessfulRequests: false,
});

const portfolioSaveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,

  keyGenerator: (req) => {
    return `user:${req.user.id}`;
  },

  message: {
    error: "Too many requests",
    message: "Please try again after 5 minutes",
    retryAfter: 5 * 60,
  },

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again after 5 minutes.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },

  skipFailedRequests: true,
  skipSuccessfulRequests: false,
});

module.exports = {
  resumeParcerLimiter,
  profileSaveLimiter,
  portfolioSaveLimiter,
};
