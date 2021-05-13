const User = require("../../models/User");

module.exports = {
    fetchUser: async (req, res) => {
        if (req.user._id == req.params.user_id) {
            res.status(200).send({ message: 'Good to go!'});
        } else res.status(401).send({ message: 'Wrong user!'});
    }
};