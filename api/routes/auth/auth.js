// import libs/other
const express = require("express");

// import controller
const authController = require("../../controllers/auth/authController");

// init router
const router = express.Router();

// user sign in
router.post("/sign-in", (req, res) => authController.signInUser(req, res));

// user sign out
router.post("/sign-out", (req, res) => authController.signOutUser(req, res));

// TODO: user forgot password

module.exports = router;