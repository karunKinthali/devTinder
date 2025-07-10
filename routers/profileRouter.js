const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt')
const { validateProfileEdit } = require('../utils/validation')
const userAuth = require('../middleware/userAuth');
const user = require('../model/user');



profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const data = req.body;
        const isEditAllowed = await validateProfileEdit(data);
        if (!isEditAllowed) {
            throw new Error("Fields inside payload are not allowed");
        }
        const loggedInUser = req.user;
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                loggedInUser[key] = data[key];
            }
        });
        await loggedInUser.save();
        res.status(200).json({
            message: "User updated successfully",
            data: loggedInUser
        });

    } catch (err) {
        console.error("Profile edit error:", err.message);
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserPassword = loggedInUser.password;
        const newPassword = req.body.password;

        const isPasswordMatch = await bcrypt.compare(newPassword, loggedInUserPassword)
        if (isPasswordMatch) {
            throw new Error("New password should not match with old password")
        }
        
        const updatedPassword = await bcrypt.hash(req.body.password, 10);
        loggedInUser.password = updatedPassword
        await loggedInUser.save();
        res.json({ message: "Password updated successfully" })

    } catch (err) {
        console.error("Password update error: ", err.message);
        res.status(400).send(err.message);

    }


})





module.exports = profileRouter;



module.exports = { profileRouter }