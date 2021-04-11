// import user model, auth helpers, middleware
const User = require("../../models/User"),
    { saltAndHashPw } = require("../../../helpers/auth");

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

            // send response
            res.status(200).send({
                success: 1,
                message: "User created successfully",
                user: userCreated
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
    fetchUser: async (req, res) => {
        // TODO: fetch user from db here
        console.log(req.user);
        res.send(req.user);
    }
};