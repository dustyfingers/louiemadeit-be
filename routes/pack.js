const express = require('express');
const router = express.Router();

const packController = require('../controllers/pack');
const { isAdmin } = require('../middleware/auth');

// create new packs
router.post('/new', isAdmin, (req, res) => {
    console.log(`${Date()} POST /packs/new`);
    packController.createPack(req, res);
});

// fetch all packs (store page)
router.get('/all', (req, res) => {
    console.log(`${Date()} GET /packs/all`);
    packController.fetchAllCurrentPacks(req, res);
});

module.exports = router;
