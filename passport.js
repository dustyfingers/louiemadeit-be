const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const User = require('./api/models/User'),
    { checkPw } = require('./helpers/auth');

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    try {
        User.findOne({ email }, (err, user) => {

            console.log(checkPw(password, user.hash));
    
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
                user
            });
        });
    } catch (error) {
        res.status(400).send({success: 0, message: 'No user found.', error})
    }

}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));