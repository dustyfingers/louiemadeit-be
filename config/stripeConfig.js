// import stripe secret key
const { stripe_sk } = require('./env');

// import stripe
const stripe = require('stripe')(stripe_sk);

module.exports = {
    stripe,
    stripeStatementDescriptor: 'louiemadeit llc',
};
