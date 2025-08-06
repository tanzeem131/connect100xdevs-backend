const mongoose = require("mongoose");
const validator = require("validator");

const socialSchema = new mongoose.Schema(
  {
    github: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    twitter: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    linkedin: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    company: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    period: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
    tech: [String],
    codelink: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
      maxlength: 400,
    },
    livelink: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
      maxlength: 400,
    },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    profilepic: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
      maxlength: 500,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    workStatus: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Open to New Opportunities",
          "Looking for Freelance",
          "Currently Working",
          "Hiring",
        ],
        message: `{VALUE} is not a valid workStatus type`,
      },
    },
    bio: {
      type: String,
      required: true,
      maxlength: 300,
    },
    socials: socialSchema,
    techStack: [String],
    experience: [experienceSchema],
    keyAchievements: [String],
    projects: [projectSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
