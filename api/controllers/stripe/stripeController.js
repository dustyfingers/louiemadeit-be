const nodemailer = require('nodemailer');

const env = require('../../../config/env');
const { stripe } = require('../../../config/stripeConfig');
const { calculateOrderAmount } = require('../../../helpers/cart');
const Track = require("../../models/Track");

// to listen for test payment_intent events on windows
// ./stripe.exe listen --forward-to localhost:5000/stripe/webhooks/handle-payment-intent

module.exports = {
    createPaymentIntent: async (req, res) => {
        try {

            console.log(req.user);
            const { items } = req.body;
            let meta = {};

            for (let i = 0; i < items.length; i++) {
                const productID = items[i].trackID;
                meta[productID] = items[i].priceID;
            }

            // TODO: add receipt_email to this to send a receipt to the customer through stripe as well
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
                    const paymentData = event.data.object.metadata;
                    for (const [key, price_id] of Object.entries(paymentData)) {
                        const price = await stripe.prices.retrieve(price_id);
            
                        // if track was sold as exclusive, mark as 'sold as exclusive' in db
                        if (price.metadata.name === 'exclusive') {
                            const product = await stripe.products.retrieve(price.product);
                            await Track.findOneAndUpdate({ trackName: product.name }, { hasBeenSoldAsExclusive: true});
                        }
                    }

                    // TODO: email customer track files
                    console.log(req);

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