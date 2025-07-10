const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema =
    new mongoose.Schema({
        firstName: {
            type: String,
            require: true,
            minlength: 3
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            min: 13
        },
        gender: {
            type: String,
            lowercase: true,
            enum: ["male", "female", "others"]
            // validate(value) {
            //     if (!["male", "female", "others"].includes(value)) {
            //         throw new Error("Invalid Gender")
            //     }
            // }
        },
        photoUrl: {
            type: String,
            default: "https://images.app.goo.gl/SESr8LGZbPu7B6Rq9",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Please enter a valid photo URL")
                }
            }
        },
        about: {
            type: String,
            default: "This is a default description of the user"
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 10) {
                    throw new Error("Only 10 skills allowed ")
                }
            }
        }
    }, {
        timestamps: true
    })

userSchema.methods.getJWT = async function () {
    const id = this._id;
    const token = await jwt.sign({ id }, 'Karun@123')
    if (!token) {
        throw new Error("invalid credentials");
    }
    return token;
}

userSchema.methods.getBcrypt = async function (passwordInputByUser) {
    const passwordHash = this.password;

    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema);