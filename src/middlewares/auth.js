const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    //Validate the token
    const decodeUserObj = await jwt.verify(token, process.env.SECRET_KEY);
    //Find the user
    const { _id } = decodeUserObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  UserAuth,
};
