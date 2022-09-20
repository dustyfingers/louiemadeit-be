const express = require('express');
const router = express.Router();

const trackController = require('../controllers/track');
const { isAdmin } = require('../middleware/auth');

// create new track
router.post('/new', isAdmin, (req, res) => {
    console.log(`${Date()} POST /tracks/new`);
    trackController.createTrack(req, res);
});

// fetch all tracks (store page)
router.get('/all', (req, res) => {
    console.log(`${Date()} GET /tracks/all`);
    trackController.fetchAllCurrentTracks(req, res);
});

module.exports = router;
