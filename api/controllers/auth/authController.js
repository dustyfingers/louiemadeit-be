// import user model and auth helpers

const User = require("../../models/User"),
    {
        checkPw,
        generateToken,
        decodeToken

    } = require("../../../helpers/auth");

module.exports = {
    // this needs to be completely reworked. use the code on github
    signInUser: async (req, res) => {
        // TODO: what are the ways to sign in?
        // you can sign in with a valid email and password
        // or you can sign in with the proper tokens validated off of your requests cookie
        // else 401

        // if there is an email and password on the given request
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;

            try {
                const foundUser = await User.findOne({ email });
                const passwordsMatch = checkPw(password, foundUser.hash);

                if (foundUser && passwordsMatch) {
                    const accessToken = generateToken(email, "access");
                    const refreshToken = generateToken(email, "refresh");

                    // set auth cookies
                    req.session.louiemadeitRefresh = refreshToken;
                    req.session.louiemadeitEmail = email;
                    req.session.louiemadeitAccess = accessToken;
                    req.session.cookie.sameSite = 'none';
                    req.session.cookie.isAdmin = foundUser.isAdmin;

                    res.status(200).send({
                        success: 1,
                        message: "Sign In Successful",
                        user: { email: foundUser.email, isAdmin: foundUser.isAdmin }
                    });
                } else {
                    // empty out auth cookies
                    req.session.louiemadeitRefresh = '';
                    req.session.louiemadeitAccess = '';
                    req.session.louiemadeitEmail = '';
                    req.session.cookie.isAdmin = '';
                    
                    res.status(401).send({
                        status: 0,
                        message: "There was an error logging in given your information. . Please try again using different credentials.",
                        err: "Invalid Credentials"
                    });
                }
                
            } catch (error) {
                res.status(401).send({
                    status: 0,
                    message: "No user was found using your information. Please try again using different credentials.",
                    err: "No User Found"
                });
            }
        } 

        // if auth cookies were sent with request
        let authCookiesSet = (req.session.louiemadeitRefresh && req.session.louiemadeitAccess && req.session.louiemadeitEmail);

        // TODO: if auth cookies sent on request 
        if (authCookiesSet) {
            const { louiemadeitRefresh, louiemadeitAccess, louiemadeitEmail, isAdmin } = req.session;
            let decodedAccessEmail = decodeToken(louiemadeitAccess);
            let decodedRefreshEmail = decodeToken(louiemadeitRefresh);

            // ? what could happen here?

            // ? 1
            // * if access token is VALID, sign in user
            if (decodedAccessEmail && (decodedAccessEmail === louiemadeitEmail)) {
                res.status(200).send({
                    success: 1,
                    message: "Sign In Successful",
                    user: { email: louiemadeitEmail, isAdmin }
                });
            }

            // ? 2
            // * if access token is INVALID but refresh token is VALID, generate a new 
            // * access token and and assign proper auth cookie, then sign in user

            else if (decodedRefreshEmail && (decodedRefreshEmail === louiemadeitEmail)) {
                const newAccessToken = generateToken(louiemadeitEmail, "access");
                req.session.louiemadeitAccess = newAccessToken;

                res.status(200).send({
                    success: 1,
                    message: "Sign In Successful",
                    user: { email: louiemadeitEmail, isAdmin }
                });
            } 

            // ? 3
            // * if neither access or refresh tokens are valid empty authCookies and return 401
            else {
                // empty out auth cookies
                req.session.louiemadeitRefresh = '';
                req.session.louiemadeitAccess = '';
                req.session.louiemadeitEmail = '';
                req.session.cookie.isAdmin = '';

                res.status(401).send({
                    success: 1,
                    message: "Please Sign In Again."
                });
            }
        }
        // if auth cookies are NOT sent on request
        else {
            // ensure nothing is in ANY of the auth cookies
            req.session.louiemadeitRefresh = '';
            req.session.louiemadeitAccess = '';
            req.session.louiemadeitEmail = '';
            req.session.cookie.isAdmin = '';

            res.status(401).send({
                success: 1,
                message: "Please Sign In Again."
            });
        }
    },
    signOutUser: async (req, res) => {
        // if the user is already signed out
        if (!req.session.louiemadeitRefresh && !req.session.louiemadeitAccess && !req.session.louiemadeitEmail) {
            res.status(200).send({
                success: 1,
                message: "User Already Signed Out. Redirecting..."
            });
        } else {
            // empty out auth cookies
            req.session.louiemadeitRefresh = '';
            req.session.louiemadeitAccess = '';
            req.session.louiemadeitEmail = '';
            req.session.cookie.isAdmin = '';
            res.status(200).send({
                success: 1,
                message: "Sign Out Successful"
            });
        }

    }
};