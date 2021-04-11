// import libs/other
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    cors = require("cors"),
    session = require("express-session"),
    bcrypt = require("bcryptjs"),
    MongoDBSession = require("connect-mongodb-session")(session);

// import config files
const dbOpts= require("./config/db"),
    env = require("./config/env");

const User = require("./api/models/User");

// connect to db & create session store
mongoose.connect(env.dbPath, dbOpts);
const store = MongoDBSession({
    uri: env.dbPath,
    collection: 'sessions'
});

// import routes
const authRoutes = require("./api/routes/auth/auth");
const userRoutes = require("./api/routes/user/user");
const trackRoutes = require("./api/routes/track/track");
const s3Routes = require("./api/routes/s3/s3");
const stripeRoutes = require("./api/routes/stripe/checkout");

// create express server & config middleware
const server = express();
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors({ origin: env.origin, credentials: true }));
server.use(session({
    secret: env.sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400
    },
    store
}));

// passport setup
server.use(passport.initialize());
server.use(passport.session());
require("./config/passportConfig")(passport);

// determine port and environment and start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`SERVER STARTED ON PORT: ${PORT}`));

// * ROUTES SETUP *
server.use("/auth", authRoutes);
server.use("/user", userRoutes);
server.use("/track", trackRoutes);
server.use("/s3", s3Routes);
server.use("/stripe", stripeRoutes);


// Routes
server.post("/sign-in", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.status(200).send({
            status: 1,
            user,
            message: "Successfully Authenticated",
            cookies: req.signedCookies
        });
        });
      }
    })(req, res, next);
});
server.post("/sign-up", (req, res) => {
    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) res.status(400).send({ status: 0, message: "Error Creating User"});
        if (doc) res.status(400).send({ status: 0, message: "User Already Exists"});
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                email: req.body.email,
                hash: hashedPassword
            });
            await newUser.save();
            res.status(200).send({
                status: 1,
                user: newUser,
                message: "User Created"
            });
        }
    });
});
server.get("/current-user", (req, res) => {
    console.log(req.sessionID);
    res.send({ user: req.user }); // The req.user stores the entire user that has been authenticated inside of it.
});