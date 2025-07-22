const express = require('express');
const userAuth = require('../middleware/userAuth');
const { ConnectionRequest } = require('../model/connectionRequest');
const userRouter = express.Router();
const User = require("../model/user")

const USER_SAFE_DATA = "firstName lastName photoUrl skills about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionData = await ConnectionRequest
            .find({ toUserId: loggedInUser._id, status: 'interested' })
            .populate('fromUserId', USER_SAFE_DATA)

        res.send({ mesage: "User data fletched successfully", data: connectionData });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser.id, status: "accepted" },
                { fromUserId: loggedInUser.id, status: "accepted" }
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
            .populate('toUserId', USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if (row.fromUserId.id.toString() == row.toUserId.id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({ data });

    } catch {
        res.status(400).json({ message: "somthing went wrong" })
    }

})


userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser.id },
                { toUserId: loggedInUser.id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser.id } }]
        }).skip(skip).limit(limit);
        res.json(users);
    } catch (err) {
        res.status(400).json(
            {
                message: err.message
            })
    }

})



module.exports = userRouter;