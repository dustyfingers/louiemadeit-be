const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid');
        }
    },
    hash: String,
    firstName: String,
    lastName: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    stripeCustomerId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", User);