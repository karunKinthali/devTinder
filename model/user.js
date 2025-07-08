const mongoose = require('mongoose')

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
            default: "https://images.app.goo.gl/SESr8LGZbPu7B6Rq9"
        },
        about: {
            type: String,
            default: "This is a default description of the user"
        },
        skills: {
            type: [String]
        }
    }, {
        timestamps: true
    })



module.exports = mongoose.model("User", userSchema);