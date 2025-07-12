const express = require('express');
const mongoose = require('mongoose');
const connectionRequestRouter = express.Router();

const userAuth = require('../middleware/userAuth');
const User = require('../model/user');
const { ConnectionRequest } = require('../model/connectionRequest');

connectionRequestRouter.post("/request/send/:status/:fromUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.fromUserId;
        const status = req.params.status;

        if (!(status === 'interested' || status === 'ignored')) {
            throw new Error("Invalid status. Must be 'interested' or 'ignored'.");
        }

        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            throw new Error("Invalid user ID format.");
        }

        // if (fromUserId.toString() === toUserId) {
        //     throw new Error(`Hey ${req.user.firstName}! You can't send a request to yourself.`);
        // }

        const isValidUser = await User.findById(toUserId);
        if (!isValidUser) {
            throw new Error("The user you are trying to send a request to was not found.");
        }

        const isAlreadyExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (isAlreadyExist) {
            throw new Error("A connection request already exists between these users.");
        }

        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await connectionRequest.save();

        res.json({ message: "Request sent successfully", data });

    } catch (err) {
        res.status(400).json({ message: `Hey ${req.user.firstName}! ${err.message}` });
    }
});

connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { requestId, status } = req.params;
        const loggedInUser = req.user;

        if (!(status === 'accepted' || status === 'rejected')) {
            throw new Error("Invalid status. Must be 'accepted' or 'rejected'.");
        }

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            throw new Error("Invalid request ID format.");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        });

        if (!connectionRequest) {
            throw new Error("Connection request not found or not in 'interested' state.");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "Request status updated successfully", data });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = { connectionRequestRouter };
