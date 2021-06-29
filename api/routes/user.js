// init router
const express = require("express");
const router = express.Router();

// import controllers, middlewares
const userController = require("../controllers/user");

router.get("/:user_id", (req, res) => userController.fetchUser(req, res));

module.exports = router;