// import secrets
const {
    stripeTest_sk
} = require("./secrets");

// import stripe
const stripe = require("stripe")(stripeTest_sk);

module.exports = {
    stripe,
    stripeStatementDescriptor: "louiemadeit llc"
};