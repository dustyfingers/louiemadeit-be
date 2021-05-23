const { stripe } = require("stripe");
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const authController = require("../../controllers/auth/authController");

const router = express.Router();

// sign up
router.post("/sign-up", (req, res, next) => authController.signUp(req, res, next));

// sign in
router.post("/sign-in", (req, res, next) => authController.signIn(req, res, next));

// fetch current user
router.get("/current-user", (req, res) => authController.fetchCurrentUser(req, res));

// sign out
router.post("/sign-out", (req, res) => authController.signOut(req, res));

// TODO: user forgot password

module.exports = router;