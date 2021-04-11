// import libs/other
const express = require("express");
const passport = require("passport");

const User = require("../../models/User");

// init router
const router = express.Router();

// passport setup
require('../../../passport');

// user sign in route
router.post("/sign-in", (req, res, next) => {
    passport.authenticate('local')(req, res, next);
});

// user sign out route
router.post("/sign-out", (req, res) => req.logout());

// TODO: user forgot password

module.exports = router;