const secrets = require('../../../config/secrets');

const stripe = require('stripe')(secrets.stripeTest_sk);

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

module.exports = {
    createPaymentIntent: async (req, res) => {
        // pull props off of request
        console.log(req.body);

        // create and save the user
        try {
            const { items } = req.body;
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: calculateOrderAmount(items),
                currency: "usd"
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            res.status(400).send({success: 0, message: 'Error while creating payment intent.', error})
        }
    }
};