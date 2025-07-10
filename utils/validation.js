const validator = require('validator');

const validateSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter First name and Last name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid Email address");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please provide a Strong Password");
    }
};

const validateProfileEdit = (data) => {
    console.log(data);
    const fieldsNotAllowed = ['emailId', 'password'];
    const isEditAllowed = Object.keys(data).every((field) => !fieldsNotAllowed.includes(field));
    return isEditAllowed;
};

module.exports = { validateSignUp, validateProfileEdit };
