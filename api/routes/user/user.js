// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const userController = require("../../controllers/user/userController"),
    {
        authorizeUser
    } = require("../../middleware/auth");



// create new user
router.post("/new", (req, res) => userController.createUser(req, res));

// user dashboard
router.post("/", authorizeUser, (req, res) => userController.fetchUserDashboard(req, res));

// TODO: user delete account

module.exports = router;