const adminAuth = (req, res, next) => {
    const token = req.query.token;
    const isAdminAuthorized = token === "xyz"
    if (!isAdminAuthorized) {
        res.status(400).send("Unauthorised Admin")
    }
    else { next() }

}

module.exports = adminAuth