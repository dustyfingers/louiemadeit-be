let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Track = new Schema({
    trackName: {
        type: String,
        required: true,
        unique: true
    },
    stripeProduct: {
        type: String,
        required: true,
        unique: true
    },
    taggedVersion: {
        type: String,
        required: true,
        unique: true
    },
    taggedVersionUrl: {
        type: String,
        default: ''
    },
    untaggedVersion: {
        type: String,
        required: true,
        unique: true
    },
    stems: {
        type: String,
        required: true,
        unique: true
    },
    coverArtUrl: {
        type: String,
        default: ''
    },
    coverArt: {
        type: String,
        required: true,
        unique: true
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
        exclusiveStripePrice: {
            type: String,
            required: true
        },
        leasePriceMaster: {
            type: Number,
            default: 29.99
        },
        leaseStripePriceMaster: {
            type: String,
            required: true
        },
        leasePriceStems: {
            type: Number,
            default: 49.99
        },
        leaseStripePriceStems: {
            type: String,
            required: true
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