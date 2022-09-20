const express = require('express');
const router = express.Router();

const stripeController = require('../controllers/stripe');

// create new payment intent
router.post('/new-payment-intent', (req, res) => {
    console.log(`${Date()} POST /stripe/new-payment-intent`);
    stripeController.createPaymentIntent(req, res);
});

// webhook for handling payment intent
router.post('/webhooks/handle-payment-intent', (req, res) => {
    console.log(`${Date()} POST /stripe/webhooks/handle-payment-intent`);
    stripeController.handlePaymentIntent(req, res);
});

// fetch a users purchases
router.get('/purchases', (req, res) => {
    console.log(`${Date()} GET /stripe/purchases`);
    stripeController.fetchPurchases(req, res);
});

module.exports = router;
