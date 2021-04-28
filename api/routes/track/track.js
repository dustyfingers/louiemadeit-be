// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const trackController = require("../../controllers/track/trackController");

// create new track
router.post("/new", (req, res) => trackController.createTrack(req, res));

// fetch all tracks (store page)
router.get("/all", (req, res) => trackController.fetchAllCurrentTracks(req, res));

// purchase items in cart
router.post("/purchase-cart", (req, res) => trackController.purchaseCart(req, res));

module.exports = router;