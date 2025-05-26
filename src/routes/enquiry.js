const Email = require("../models/email");
const express = require("express");
const enquiryRouter = express.Router();

enquiryRouter.post("/enquiry", async (req, res, next) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email is required" });
    }

    const isEmailExist = await Email.findOne({ emailId });

    if (isEmailExist) {
      return res.status(403).json({ message: "Email already Exist" });
    }

    const email = new Email({
      emailId,
    });

    await email.save();

    res.status(201).json({ message: "Email added successfully!" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = enquiryRouter;
