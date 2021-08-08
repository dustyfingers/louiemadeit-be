const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/:user_id", (req, res) => {
    console.log(`${Date()} GET /user/${req.query.user_id}`);
    userController.fetchUser(req, res);
});

// TODO: edit user profile/email?

module.exports = router;