// import user model and auth helpers
const { decode } = require("jsonwebtoken");
const User = require("../../models/User"),
    {
        checkPw,
        generateToken,
        decodeToken,
        REFRESH_COOKIE_NAME,
        ACCESS_COOKIE_NAME,
        EMAIL_COOKIE_NAME,
        MAX_AGE_ONE_DAY,
        MAX_AGE_THIRTY_DAYS
    } = require("../../../helpers/auth");

module.exports = {
    signInUser: async (req, res) => {
        console.log(req.cookies);
        // if no cookies on request
        if (!req.cookies.louiemadeitRefresh && !req.cookies.louiemadeitAccess && !req.cookies.louiemadeitEmail) {
            const {
                email,
                password
            } = req.body;

            try {
                // find user and handle if no user found
                const user = await User.findOne({ email });
    
                // if user is found in the db
                if (user) {
                    if (password) {
                        // check passwords
                        const {
                            hash
                        } = user;
                        const passwordsMatch = checkPw(password, hash);

                        // if passwords match, grant access and refresh token cookies to client
                        if (passwordsMatch) {
                            const accessToken = generateToken(email, "access");
                            const refreshToken = generateToken(email, "refresh");

                            // set cookies
                            res.cookie(REFRESH_COOKIE_NAME, refreshToken, {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
                            res.cookie(EMAIL_COOKIE_NAME, email, {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
                            res.cookie(ACCESS_COOKIE_NAME, accessToken, {maxAge: MAX_AGE_ONE_DAY, httpOnly: true, signed: true, domain: ".app.localhost"});

                            res.status(200).send({
                                success: 1,
                                message: "Sign In Successful",
                                user: user.email
                            });
                        } else {
                            // if passwords do not match send a fail message
                            const responseBody = {
                                status: 0,
                                message: "There was an error logging in given your information. . Please try again using different credentials.",
                                err: "Invalid Credentials"
                            };
                            res.status(401).send(responseBody);
                        }
                    } else {
                        res.status(401).send({
                            status: 0,
                            message: "Request unauthorized. Please log in again.",
                            err: "No password given."
                        });
                    }
                } 
                // if there is no user found in the db
                else {
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
        else if (req.cookies) {
            const { louiemadeitRefresh, louiemadeitAccess, louiemadeitEmail } = req.cookies;

            try {
                // if access token is valid 
                // sign in user
                let decodedAccessEmail = decodeToken(louiemadeitAccess);
                let decodedRefreshEmail = decodeToken(louiemadeitRefresh);

                if (decodedAccessEmail && (decodedAccessEmail === louiemadeitEmail)) {
                    res.status(200).send({
                        success: 1,
                        message: "Sign In Successful",
                        user: louiemadeitEmail
                    });
                } 

                // if access token is invalid but refresh token is valid
                // generate a new access token and and assign cookie
                else if (decodedRefreshEmail && (decodedRefreshEmail === louiemadeitEmail)) {
                    const newAccessToken = generateToken(louiemadeitEmail, "access");
                    
                    res.cookie(ACCESS_COOKIE_NAME, newAccessToken, {maxAge:MAX_AGE_ONE_DAY, httpOnly: true, signed: true, domain: ".app.localhost"});

                    res.status(200).send({
                        success: 1,
                        message: "Sign In Successful",
                        user: louiemadeitEmail
                    });
                } 
                // if neither are valid set cookies to empty and return an error
                else {
                res.cookie(REFRESH_COOKIE_NAME, '', {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
                res.cookie(EMAIL_COOKIE_NAME, '', {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
                res.cookie(ACCESS_COOKIE_NAME, '', {maxAge: MAX_AGE_ONE_DAY, httpOnly: true, signed: true, domain: ".app.localhost"});
                res.status(401).send({
                    success: 1,
                    message: "Tokens Invlaid. Please Sign In Again."
                });
                }

    

            } catch (err) {
                const responseBody = {
                    status: 0,
                    message: "There was an error logging you in. Please try again."
                };
                res.status(401).send(responseBody);
            }
        }
    },
    signOutUser: async (req, res) => {
        // if the user is already signed out
        if (!req.cookies.louiemadeitRefresh && !req.cookies.louiemadeitAccess && !req.cookies.louiemadeitEmail) {
            res.status(200).send({
                success: 1,
                message: "User Already Signed Out. Redirecting..."
            });
        } else {
            res.cookie(REFRESH_COOKIE_NAME, '', {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
            res.cookie(EMAIL_COOKIE_NAME, '', {maxAge: MAX_AGE_THIRTY_DAYS, httpOnly: true, signed: true, domain: ".app.localhost"});
            res.cookie(ACCESS_COOKIE_NAME, '', {maxAge: MAX_AGE_ONE_DAY, httpOnly: true, signed: true, domain: ".app.localhost"});
            res.status(200).send({
                success: 1,
                message: "Sign Out Successful"
            });
        }

    }
};