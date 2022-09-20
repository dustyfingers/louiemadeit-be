const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// sign up
router.post('/sign-up', (req, res, next) => {
    console.log(`${Date()} POST /auth/sign-up`);
    authController.signUp(req, res, next);
});

// sign in
router.post('/sign-in', (req, res, next) => {
    console.log(`${Date()} POST /auth/sign-in`);
    authController.signIn(req, res, next);
});

// fetch current user
router.get('/current-user', (req, res) => {
    console.log(`${Date()} GET /auth/current-user`);
    authController.fetchCurrentUser(req, res);
});

// sign out
router.post('/sign-out', (req, res) => {
    console.log(`${Date()} POST /auth/sign-out`);
    authController.signOut(req, res);
});

// TODO: user forgot password

// TODO: user email verification

module.exports = router;
