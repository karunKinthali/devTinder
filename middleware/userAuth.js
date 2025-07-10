const jwt = require('jsonwebtoken')
const User = require('../model/user')

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is empty, please login again...");
        }
        const decodedData = await jwt.verify(token, 'Karun@123');
        if (!decodedData) {
            throw new Error("Invalid token, please logi again...");
        }
        const user = await User.findById(decodedData.id);
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
};

module.exports = userAuth;