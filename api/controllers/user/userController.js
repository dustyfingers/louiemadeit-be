// import user model, auth helpers, middleware
const User = require("../../models/User"),
    {
        saltAndHashPw,
        generateToken,
        ACCESS_COOKIE_NAME,
        REFRESH_COOKIE_NAME,
        EMAIL_COOKIE_NAME,
        MAX_AGE_ONE_DAY,
        MAX_AGE_THIRTY_DAYS
    } = require("../../../helpers/auth");

module.exports = {
    createUser: async (req, res) => {
        // pull props off of request
        const {
            email,
            password,
            isAdmin
        } = req.body;

        // create and save the user
        try {
            // salt and hash pw
            const hash = saltAndHashPw(password);
            let userCreated;

            // create a user in db
            if (isAdmin) {
                userCreated = await User.create({
                    email,
                    hash,
                    isAdmin
                });
            } else {
                userCreated = await User.create({
                    email,
                    hash
                });
            }

            // generate tokens and send response
            const refreshToken = generateToken(email, "refresh");
            const accessToken = generateToken(email, "access");
            
            // set session data for cookies
            req.session.louiemadeitRefresh = refreshToken;
            req.session.louiemadeitEmail = email;
            req.session.louiemadeitAccess = accessToken;

            console.log(req.session.cookie);

            // send response
            res.status(200).send({
                success: 1,
                message: "User created successfully"
            });
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error creating a user given your information.",
                err
            };
            res.status(400).send(responseBody);
        }
    }
};