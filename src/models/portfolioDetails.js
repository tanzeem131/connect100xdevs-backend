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
      trim: true,
      maxlength: 100,
    },
    linkedin: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    leetcode: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    period: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
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
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    tech: {
      type: [String],
      validate: {
        validator: function (skills) {
          return (
            skills.length <= 30 && skills.every((skill) => skill.length <= 50)
          );
        },
        message:
          "You can only specify up to 30 skills, each up to 50 characters long.",
      },
    },
    codelink: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid codelink URL: " + value);
        }
      },
      maxlength: 400,
    },
    livelink: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid livelink URL:" + value);
        }
      },
      maxlength: 400,
    },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    owner: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    link: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid Link: " + value);
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 40,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error("Email id is invalid" + value);
        }
      },
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
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
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
    techStack: {
      type: [String],
      validate: {
        validator: function (skills) {
          if (!skills || skills.length === 0) return true;
          return (
            skills.length <= 50 && skills.every((skill) => skill.length <= 50)
          );
        },
        message:
          "You can only specify up to 50 skills, each up to 50 characters long.",
      },
    },
    currentlyExploring: {
      type: [String],
      validate: {
        validator: function (skills) {
          if (!skills || skills.length === 0) return true;
          return (
            skills.length <= 30 && skills.every((skill) => skill.length <= 50)
          );
        },
        message:
          "You can only specify up to 30 skills, each up to 50 characters long.",
      },
    },
    experience: [experienceSchema],
    keyAchievements: [String],
    projects: [projectSchema],
    articles: [articleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
