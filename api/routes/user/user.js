// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const userController = require("../../controllers/user/userController");

// create new user
router.post("/new", (req, res) => userController.createUser(req, res));

router.get("/user", (req, res) => userController.fetchUser(req, res));

module.exports = router;