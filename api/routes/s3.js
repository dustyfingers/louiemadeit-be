const express = require("express");
const router = express.Router();

// import controllers, middlewares
const s3Controller = require("../controllers/s3");

// generate put s3 url
router.get("/generate-put-url", (req, res) => s3Controller.generatePutUrl(req, res));

// generate get s3 url
router.get("/generate-get-url", (req, res) => s3Controller.generateGetUrl(req, res));

module.exports = router;