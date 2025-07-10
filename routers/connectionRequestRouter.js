const express = require('express');
const connnectionRequestRouter = express.Router();

const userAuth = require('../middleware/userAuth')

connnectionRequestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    console.log("Entered to sendConnectionRequest");
    res.send("sendConnectionRequest");
})

module.exports = { connnectionRequestRouter }