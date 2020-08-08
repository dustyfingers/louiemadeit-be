// fe requests generate-put-url endpoint for an s3 url to PUT the image to
// generate-put-url endpoint responds with an s3 url, and fe then makes a put request to that s3 url
// generated s3 endpoint then responds with success or failure

// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const s3Controller = require("../../controllers/s3/s3Controller"),
    {
        authorizeUser
    } = require("../../../middleware/auth");

// generate put s3 url
// TODO: admin only!
router.get("/generate-put-url", (req, res) => s3Controller.generatePutUrl(req, res));

// generate get s3 url
router.get("/generate-get-url", (req, res) => s3Controller.generateGetUrl(req, res));
module.exports = router;