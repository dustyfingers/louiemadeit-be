let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Pack = new Schema({
    packName: {
        type: String,
        required: true,
        unique: true,
    },
    stripeProduct: {
        type: String,
        required: true,
        unique: true,
    },
    stripePrice: {
        type: String,
        required: true,
        unique: true,
    },
    zip: {
        type: String,
        required: true,
        unique: true,
    },
    coverArtUrl: {
        type: String,
        default: '',
    },
    coverArt: {
        type: String,
        required: true,
        unique: true,
    },
    numTimesPurchased: {
        type: Number,
        default: 0,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 19.99,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    meta: {
        description: String,
    },
});

module.exports = mongoose.model('Pack', Pack);
