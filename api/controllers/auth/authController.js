// import libs/other
const mongoose = require("mongoose")

// import user model and auth helpers
const User = require("../../models/User"),
    {
        checkPw,
        generateToken
    } = require("../../../helpers/auth");

module.exports = {
    signInUser: async (req, res) => {
        console.log(req);
        console.log('this happens');

        // pull props off of request
        const {
            email,
            password
        } = req.body;

        try {
            // find user and handle if no user found
            const user = await User.findOne({
                email
            });

            if (user !== null) {
                // check passwords
                const {
                    hash
                } = user;
                const passwordsMatch = checkPw(password, hash);

                // if passwords match, grant access and refresh tokens
                if (passwordsMatch) {
                    const refreshToken = generateToken(email, "refresh");
                    const accessToken = generateToken(email, "access");

                    res.status(200).send({
                        success: 1,
                        accessToken,
                        refreshToken
                    });
                } else {
                    // if passwords do not match send a fail message
                    const responseBody = {
                        status: 0,
                        message: "There was an error logging in given your information. Please try again using different credentials.",
                        err: "Invalid Credentials"
                    };
                    res.status(401).send(responseBody);
                }
            } else {
                const responseBody = {
                    status: 0,
                    message: "No user was found using your information. Please try again using different credentials.",
                    err: "No User Found"
                };
                res.status(401).send(responseBody);
            }
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error logging in given your information. Please try again using different credentials.",
                err
            };
            res.status(401).send(responseBody);
        }
    }
};