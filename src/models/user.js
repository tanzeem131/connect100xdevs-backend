const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 40,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email id is invalid");
        }
      },
    },
    githubUsername: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 80,
    },
    gender: {
      type: String,
      trim: true,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
      maxlength: 500,
    },
    about: {
      type: String,
      default: "Even I don't know about me",
      maxlength: 200,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return (
            skills.length <= 10 && skills.every((skill) => skill.length <= 50)
          );
        },
        message:
          "You can only specify up to 10 skills, each up to 50 characters long.",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "tanzeem@ss", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isvalidatePassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isvalidatePassword;
};

module.exports = mongoose.model("User", userSchema);
