// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const stripeController = require("../../controllers/stripe/stripeController");

// create new payment intent
router.post("/new-payment-intent", (req, res) => stripeController.createPaymentIntent(req, res));

module.exports = router;