// TODO: new auth flow
// check req for cookies instead of request.body


// import user model and auth helpers
const User = require("../../models/User"),
    {
        checkPw,
        generateToken,
        decodeToken
    } = require("../../../helpers/auth");

module.exports = {
    signInUser: async (req, res) => {
        // pull props off of request
        const {
            email,
            password,
            refreshToken
        } = req.body;

        // // if user has no cookies already set
        // // check if user exists and info is valid 
        // // if user exists sign them in and set cookies
        // if (!req.cookies.refreshToken && !req.cookies.accessToken && !req.cookies.email) {
        //     console.log(req);


        // }
        
        // // if user already has cookies set
        // // check if user exists and verify info in those coookies
        // // if info is valid send user signed in message
        // // if not ask to log in again
        // if (req.cookies.refreshToken && req.cookies.accessToken && req.cookies.email) {
        //     const { refreshToken, accessToken, email } = req.cookies;
        //     console.log('cookies found!')

        // }


        console.log(req.cookies);


        try {
            // find user and handle if no user found
            const user = await User.findOne({ email });

            if (user) {
                if (password) {
                    // check passwords
                    const {
                        hash
                    } = user;
                    const passwordsMatch = checkPw(password, hash);

                    // if passwords match, grant access and refresh tokens
                    if (passwordsMatch) {
                        const accessToken = generateToken(email, "access");

                        let newRefreshToken = refreshToken ? refreshToken : generateToken(email, "refresh");

                        // set cookies
                        res.cookie('louiemadeitRefresh', newRefreshToken, {maxAge: 86400, httpOnly: true});
                        res.cookie('louiemadeitEmail', email, {maxAge: 86400, httpOnly: true});
                        res.cookie('louiemadeitAccess', accessToken, {maxAge: 86400, httpOnly: true});

                        res.status(200).send({
                            success: 1,
                            message: "Sign In Successful",
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
                } else if (refreshToken) {
                    // if email from decoded token and email match
                    let decodedRefreshEmail = decodeToken(refreshToken);
                    if (decodedRefreshEmail === email) {
                        let accessToken = generateToken(email, "access");
                        res.cookie('louiemadeitAccess', accessToken, {maxAge: 86400, httpOnly: true});
                        res.status(200).send({
                            success: 1,
                            message: 'Sign In Successful!'
                        });
                    } else {
                        res.status(401).send({
                            status: 0,
                            message: "Request unauthorized. Please log in again."
                        });
                    }
                } else {
                    res.status(401).send({
                        status: 0,
                        message: "Request unauthorized. Please log in again."
                    });
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