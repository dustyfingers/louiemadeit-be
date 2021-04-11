// import libs/other
const bcryptjs = require("bcryptjs"),
    jwt = require("jsonwebtoken");

// import secrets, etc
const { jwtSecret } = require("../config/env");

module.exports = {
    saltAndHashPw: pw => {
        const salt = bcryptjs.genSaltSync(10);
        return bcryptjs.hashSync(pw, salt);
    },
    checkPw: (givenPw, storedHash) => bcryptjs.compareSync(givenPw, storedHash),
    generateToken: (email, type) => {
        let expiration;
        switch (type) {
            case "refresh":
                expiration = "14d";
                break;
            case "access":
                expiration = "12h";
                break;
            case "passwordReset":
                expiration = "30m";
                break;
            default:
                return;
        }
        let token = jwt.sign({
            data: email
        }, jwtSecret, {
            expiresIn: expiration
        });
        return token;
    },
    decodeToken: token => {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            return decoded.data;
        } catch (err) {
            return false;
        }
    },
    REFRESH_COOKIE_NAME: "louiemadeitRefresh",
    ACCESS_COOKIE_NAME: "louiemadeitAccess",
    EMAIL_COOKIE_NAME: "louiemadeitEmail",
    MAX_AGE_THIRTY_DAYS: 2592000,
    MAX_AGE_ONE_DAY: 86400
};