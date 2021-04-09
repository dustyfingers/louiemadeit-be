// import user model and auth helpers

const User = require("../../models/User"),
    {
        checkPw,
        generateToken,
        decodeToken

    } = require("../../../helpers/auth");

module.exports = {
    signInUser: async (req, res) => {
        // TODO: client (when browser) not getting cookies!
        // client (when insomina) works fine!
        // you can sign in with a valid email and password
        // or you can sign in with the proper tokens validated off of your requests cookie
        // else ensure every auth cookie is empty and 401

        let authCookiesSet = (req.session.louiemadeitRefresh && req.session.louiemadeitAccess && req.session.louiemadeitEmail);

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
                    req.session.isAdmin = foundUser.isAdmin;

                    res.status(200).send({
                        success: 1,
                        message: "Email Sign In Successful",
                        user: { email: foundUser.email, isAdmin: foundUser.isAdmin }
                    });
                } else {
                    // empty out auth cookies
                    req.session.louiemadeitRefresh = '';
                    req.session.louiemadeitAccess = '';
                    req.session.louiemadeitEmail = '';
                    req.session.isAdmin = '';

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
            
        } else if (authCookiesSet) {
            const { louiemadeitRefresh, louiemadeitAccess, louiemadeitEmail } = req.session;
            let decodedAccessEmail = decodeToken(louiemadeitAccess);
            let decodedRefreshEmail = decodeToken(louiemadeitRefresh);
            const foundUser = await User.findOne({ email: louiemadeitEmail });

            // ? what could happen here?

            // ? 1
            // * if access token is VALID, sign in user
            if (decodedAccessEmail && (decodedAccessEmail === louiemadeitEmail)) {
                console.log('access sign in attempted')
                res.status(200).send({
                    success: 1,
                    message: "Access Sign In Successful",
                    user: { email: louiemadeitEmail, isAdmin: foundUser.isAdmin }
                });
            }

            // ? 2
            // * if access token is INVALID but refresh token is VALID, generate a new 
            // * access token and and assign proper auth cookie, then sign in user
            else if (decodedRefreshEmail && (decodedRefreshEmail === louiemadeitEmail)) {
                console.log('refresh sign in attempted')
                const newAccessToken = generateToken(louiemadeitEmail, "access");
                req.session.louiemadeitAccess = newAccessToken;

                res.status(200).send({
                    success: 1,
                    message: "Refresh Sign In Successful",
                    user: { email: louiemadeitEmail, isAdmin: foundUser.isAdmin }
                });
            } 

            // ? 3
            // * if neither access or refresh tokens are valid empty authCookies and return 401
            else {
                console.log('auth cookies not set')
                // empty out auth cookies
                req.session.louiemadeitRefresh = '';
                req.session.louiemadeitAccess = '';
                req.session.louiemadeitEmail = '';
                req.session.isAdmin = '';

                res.status(401).send({
                    success: 1,
                    message: "Please Sign In Again."
                });
            }
        }
        // if neither auth cookies or email and pw are sent on request
        else {
            console.log('NEITHER auth cookies or email and password sent');
            // empty out auth cookies
            req.session.louiemadeitRefresh = '';
            req.session.louiemadeitAccess = '';
            req.session.louiemadeitEmail = '';
            req.session.isAdmin = '';

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
            req.session.isAdmin = '';
            res.status(200).send({
                success: 1,
                message: "Sign Out Successful"
            });
        }

    }
};