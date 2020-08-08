// import user model, auth helpers, middleware
const User = require("../../models/User"),
    {
        saltAndHashPw,
        generateToken
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

            // create a user in db
            if (isAdmin) {
                var userCreated = await User.create({
                    email,
                    hash,
                    isAdmin
                });
            } else {
                var userCreated = await User.create({
                    email,
                    hash
                });
            }

            // generate tokens and send response
            const refreshToken = generateToken(email, "refresh");
            const accessToken = generateToken(email, "access");
            res.status(200).send({
                success: 1,
                refreshToken,
                accessToken
            });
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error creating a user given your information.",
                err
            };
            res.status(400).send(responseBody);
        }
    },
    fetchUserDashboard: async (req, res) => {
        const {
            email
        } = req.body;
        const user = await User.findOne({
            email
        });
        res.status(200).send({
            success: 1,
            user
        });
    }
};