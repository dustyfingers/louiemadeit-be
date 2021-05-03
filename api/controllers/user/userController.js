const User = require("../../models/User");

module.exports = {
    fetchUser: async (req, res) => {
        console.log(req);
        res.status(200).send({ message: 'Good to go!'});
    }
};