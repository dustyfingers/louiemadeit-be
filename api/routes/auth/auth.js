// import libs/other
const express = require("express");

// import controller
const authController = require("../../controllers/auth/authController");

// init router
const router = express.Router();

// user sign in
router.post("/signin", (req, res) => authController.signInUser(req, res));

// TODO: user 'logout'

// TODO: user forgot password

module.exports = router;