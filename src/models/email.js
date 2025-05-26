const mongoose = require("mongoose");
const validator = require("validator");

const emailSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Email", emailSchema);
