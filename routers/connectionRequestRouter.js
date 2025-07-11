const express = require('express');
const connectionRequestRouter = express.Router();

const userAuth = require('../middleware/userAuth');
const user = require('../model/user');
const { ConnectionRequest } = require('../model/connectionRequest')

connectionRequestRouter.post("/request/send/:status/:fromUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.fromUserId;
        const status = req.params.status;

        if (!(status == 'interested' || status == 'ignored')) {
            throw new Error("You are sending an invalid request")
        }
        // if (fromUserId == toUserId) {
        //     throw new Error(`Hey ${req.user.firstName} !!!, You can't make request your self`)
        // }
        const isValidUser = await user.findById(toUserId);
        if (!isValidUser) {
            throw new Error("the User you are trying to send request is not found")
        }
        const isAlreadyExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { toUserId: fromUserId, fromUserId: toUserId }]

        });
        if (isAlreadyExist) {
            throw new Error("the request your are trying is already placed, please try again with a new one..")
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();
        res.json({
            message: "Request sent successfully",
            data
        })

    } catch (err) {
        res.status(400).json({ message: `Hey ${req.user.firstName} !!!, ` + err.message })
    }

})

module.exports = { connectionRequestRouter }