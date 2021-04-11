// import libs/other
const express = require("express");
const passport = require("passport");

// init router
const router = express.Router();

// user sign in route
router.post("/sign-in", (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            res.status(401).send({
                status: 0,
                message: "There was an error logging in given your information. Please try again using different credentials.",
                error
            });
        }
        if (!user) {
            res.status(401).send({
                status: 0,
                message: "No user was found using your information. Please try again using different credentials.",
                err: "No User Found"
            });
        } else req.logIn(user, error => {
            if (error) {
                res.status(401).send({
                    status: 0,
                    message: "There was an error logging in given your information. Please try again using different credentials.",
                    error
                });
            }
            res.status(200).send({
                status: 1,
                message: "Sign in successful.",
                user
            })
        });
    })(req, res, next);
});

// user sign out route
router.post("/sign-out", (req, res) => req.logout());

// TODO: user forgot password

module.exports = router;