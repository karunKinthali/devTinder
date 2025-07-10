const validator = require('validator')

const validateSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter First name and Last name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid Email address")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("please provide a Strong Password")
    }
}

module.exports = validateSignUp;