// import auth helpers
const {
    decodeToken,
    generateToken
} = require("../helpers/auth");

// import model
const User = require("../api/models/User");

module.exports = {
    authorizeUser: (req, res, next) => {
        // pull props off request
        const {
            email,
            accessToken,
            refreshToken
        } = req.body;

        // if there is a valid access token that matches the given email grant request as usual
        if (accessToken) {
            let decodedAccessEmail = decodeToken(accessToken);
            if (decodedAccessEmail && decodedAccessEmail === email) next();
            else if (refreshToken) {
                let decodedRefreshEmail = decodeToken(refreshToken);
                if (decodedRefreshEmail === email) {
                    let newAccessToken = generateToken(email, "access");
                    res.status(200).send({
                        success: 1,
                        newAccessToken
                    });
                } else {
                    res.status(401).send({
                        status: 0,
                        message: "Request unauthorized. Please log in again."
                    });
                }
            } else
                res.status(401).send({
                    status: 0,
                    message: "Request unauthorized. Please log in again."
                });
        } else if (!accessToken && !refreshToken) {
            res.status(401).send({
                status: 0,
                message: "Request unauthorized. Please log in again."
            });
        }
    },
    determineIfAdmin: async (req, res, next) => {
        const {
            email
        } = req.body;

        try {
            // find user
            const user = await User.findOne({
                email
            });

            // if user is admin call next
            if (user !== null && user.isAdmin) next();
            else {
                const responseBody = {
                    status: 0,
                    message: "There was an error with your credentials. Please try again using different credentials.",
                    err: "Unauthorized Admin"
                };
                res.status(401).send(responseBody);
            }
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error with your credentials. Please try again using different credentials.",
                err
            };
            res.status(401).send(responseBody);
        }
    }
};