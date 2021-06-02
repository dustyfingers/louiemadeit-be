module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(401).send({msg: "Ah Ah Ah. You didn't say the magic word."});
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) next();
    else res.status(401).send({msg: "Ah Ah Ah. You didn't say the magic word. Also you aren't an admin."});
}