// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const trackController = require("../../controllers/track/trackController"),
    {
        authorizeUser
    } = require("../../../middleware/auth");

// create new track
router.post("/new", (req, res) => trackController.createTrack(req, res));

// fetch all tracks (store page)
router.get("/all", (req, res) => trackController.fetchAllCurrentTracks(req, res));

module.exports = router;