const LocalStrategy = require('passport-local').Strategy;

const User = require('../api/models/User'),
    { checkPw } = require('../helpers/auth');

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        try {
            User.findOne({ email }, (err, user) => {
                if (err) return done(err);
                if (!user) return done(null, false, {
                    status: 0,
                    message: "There was an error logging in given your email. Please try again using different credentials.",
                    err: "Invalid Credentials"
                });
        
                if (!checkPw(password, user.hash)) return done(null, false, {
                    status: 0,
                    message: "There was an error logging in given your password. Please try again using different credentials.",
                    err: "Invalid Credentials"
                });
        
                return done(null, user, {
                    status: 1,
                    message: "Sign In Successful.",
                    user: { email: user.email, isAdmin: user.isAdmin }
                });
            });
        } catch (error) {
            res.status(400).send({success: 0, message: 'No user found.', error})
        }
    }));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findOne({ "_id": id }, (err, user) => done(err, user)));
};

