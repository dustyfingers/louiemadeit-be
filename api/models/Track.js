let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Track = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    taggedVersion: {
        url: String
    },
    untaggedVersion: {
        url: String
    },
    stems: [{
        name: {
            type: String,
            unique: true,
            required: true
        },
        url: {
            type: String,
            unique: true,
            required: true
        },
    }],
    coverArt: {
        url: String
    },
    canBeSoldAsLease: {
        type: Boolean,
        default: true,
        required: true
    },
    numTimesPurchasedAsLease: {
        type: Number,
        default: 0,
        required: true
    },
    canBeSoldAsExclusive: {
        type: Boolean,
        default: true,
        required: true
    },
    hasBeenSoldAsExclusive: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    meta: {
        description: String,
        lengthInSec: Number
    }
});

module.exports = mongoose.model("Track", Track);