const express = require('express')
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const validator = require('validator');

const validateSignUp = require('../utils/validateSignUp')

const User = require('../model/user');


authRouter.post("/signup", async (req, res) => {
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ firstName, lastName, emailId, password: hashedPassword });
        await user.save();
        res.send(`User ${user.firstName.toUpperCase()} saved successfully`);
    } catch (err) {
        res.status(400).send("Error while saving the data:" + err.message)
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email format");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await user.getBcrypt(password);

        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        const jwtToken = await user.getJWT();
        res.cookie('token', jwtToken, { expires: new Date(Date.now() + 1 * 3600000) })
        res.status(200).send("Logged in successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = { authRouter }