// import libs/other
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

// init router
const router = express.Router();

// user sign in route
router.post("/sign-in", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.status(200).send({
            status: 1,
            user,
            message: "Successfully Authenticated",
            cookies: req.signedCookies
        });
        });
      }
    })(req, res, next);
});

// user sign up route
router.post("/sign-up", (req, res) => {
    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) res.status(400).send({ status: 0, message: "Error Creating User"});
        if (doc) res.status(400).send({ status: 0, message: "User Already Exists"});
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                email: req.body.email,
                hash: hashedPassword
            });
            await newUser.save();
            res.status(200).send({
                status: 1,
                user: newUser,
                message: "User Created"
            });
        }
    });
});

// fetch current user
router.get("/current-user", (req, res) => {
    console.log(req.sessionID);
    res.send({ user: req.user }); // The req.user stores the entire user that has been authenticated inside of it.
});

// user sign out route
router.post("/sign-out", (req, res) => req.logOut());

// TODO: user forgot password

module.exports = router;