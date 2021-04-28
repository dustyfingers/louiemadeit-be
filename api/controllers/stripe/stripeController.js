const env = require('../../../config/env');

const { stripe } = require('../../../config/stripeConfig');
const { calculateOrderAmount, handlePaymentIntentSucceeded } = require('../../../helpers/cart');

// to listen for test events on windows
// ./stripe.exe listen --forward-to localhost:5000/stripe/webhooks/handle-payment-intent

module.exports = {
    createPaymentIntent: async (req, res) => {
        try {
            const { items } = req.body;
            let meta = {};

            for (let i = 0; i < items.length; i++) {
                const productID = items[i].trackID;
                meta[productID] = items[i].priceID;
            }

            // TODO: add receipt_email to this to send a receipt to the customer
            const paymentIntent = await stripe.paymentIntents.create({
                amount: await calculateOrderAmount(items),
                currency: "usd",
                metadata: meta
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

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log(`Payment intent for ${paymentIntent.amount} was successful!`);

                    // TODO: mark item as sold in db here
                    handlePaymentIntentSucceeded(paymentIntent);

                    response.status(200).send({ message: "db stuff done with items!"});
                    
                    break;
                default:
                    break;
            }

            response.status(200).send();

        } catch (error) {
            res.status(400).send({success: 0, message: 'Error while handling payment intent.', error})
        }
    },
};