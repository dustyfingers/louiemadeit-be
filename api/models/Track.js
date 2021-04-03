let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Track = new Schema({
    trackName: {
        type: String,
        required: true
    },
    taggedVersion: {
        type: String,
        required: true
    },
    untaggedVersion: {
        type: String,
        required: true
    },
    stems: {
        type: String,
        required: true
    },
    coverArt: {
        type: String,
        required: true
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
    prices: {
        exclusivePrice: {
            type: Number,
            default: 149.99
        },
        leasePriceMaster: {
            type: Number,
            default: 29.99
        },
        leasePriceStems: {
            type: Number,
            default: 49.99
        },
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