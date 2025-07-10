const express = require('express');
const profileRouter = express.Router();

const userAuth = require('../middleware/userAuth')



profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // const token = req.cookies.token;
    // if (!token) {
    //   throw new Error("Token missing. Please login again.");
    // }

    // const decoded = jwt.verify(token, 'Karun@123');
    // if (!decoded || !decoded.id) {
    //   throw new Error("Invalid token. Please login again.");
    // }

    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   throw new Error("User not found.");
    // }
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(400).send(err.message);
  }
});
module.exports = { profileRouter }