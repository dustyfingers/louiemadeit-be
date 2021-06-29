const express = require("express");
const router = express.Router();

// import controllers, middlewares
const stripeController = require("../controllers/stripe");

// create new payment intent
router.post("/new-payment-intent", (req, res) => stripeController.createPaymentIntent(req, res));

// webhook for handling payment intent
router.post("/webhooks/handle-payment-intent", (req, res) => stripeController.handlePaymentIntent(req, res));

// fetch a users purchased tracks
router.get("/purchased-tracks", (req, res) => stripeController.fetchPurchasedTracks(req, res));

module.exports = router;