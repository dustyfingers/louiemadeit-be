const express = require('express');
const router = express.Router();

const s3Controller = require('../controllers/s3');

// generate put s3 url
router.get('/generate-put-url', (req, res) => {
    console.log(`${Date()} GET /s3/generate-put-url`);
    s3Controller.generatePutUrl(req, res);
});

// generate get s3 url
router.get('/generate-get-url', (req, res) => {
    console.log(`${Date()} GET /s3/generate-get-url`);
    s3Controller.generateGetUrl(req, res);
});

module.exports = router;
