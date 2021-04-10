const env = require('../../../config/env');

const { stripe } = require('../../../config/stripeConfig');

const calculateOrderAmount = items => {
    // TODO: ! important!!!
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

module.exports = {
    createPaymentIntent: async (req, res) => {
        try {
            const { items } = req.body;
            console.log(items);

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
    },
    handlePaymentIntent: async (req, res) => {
        try {
            const event = req.body;
            console.log(event.type);

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log(`Payment intent for ${paymentIntent.amount} was successful!`);

                    // TODO: mark item as sold in db here
                    // handlePaymentIntentSucceeded(paymentIntent);

                    response.status(200).send({ message: "db stuff done with items!"});
                    
                    break;
                default:
                    console.log(`Unknown event type ${event.type}`);
                    break;
            }

            response.status(200).send();

        } catch (error) {
            res.status(400).send({success: 0, message: 'Error while handling payment intent.', error})
        }
    },
};