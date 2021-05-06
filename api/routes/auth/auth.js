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
            console.log({user});
            console.log('this too!');
            console.log({req});
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(200).send({
                    status: 1,
                    user: { email: user.email, isAdmin: user.isAdmin, id: user._id },
                    message: "Successfully Authenticated",
                    cookies: req.signedCookies
                });
            });
        }
    })(req, res, next);
});

// user sign up route
router.post("/sign-up", (req, res, next) => {
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
            passport.authenticate('local', (err, user) => {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    res.status(200).send({
                        status: 1,
                        user: { email: newUser.email, isAdmin: newUser.isAdmin, id: newUser._id },
                        message: "Successfully Authenticated",
                        cookies: req.signedCookies
                    });
                });
            })(req, res, next);
        }
    });
});

// fetch current user
router.get("/current-user", (req, res) => {
    console.log(req.user);
    console.log(req.session);
    if (req.user){
        res.send({ 
            user: { 
                email: req.user.email, 
                isAdmin: req.user.isAdmin, 
                id: req.user._id 
            }
        });
    } else res.status(200).send({user: null});
});

// user sign out route
router.post("/sign-out", (req, res) => {
    req.logOut();
    res.status(200).send({
        status: 1,
        message: "User Logged Out"
    });
});

// TODO: user forgot password

module.exports = router;