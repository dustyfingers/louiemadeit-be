const { stripe } = require('../../../config/stripeConfig');
const { calculateOrderAmount } = require('../../../helpers/cart');
const Track = require("../../models/Track");
const transporter = require('../../../config/nodemailerConfig');
const { generateUrlHelper } = require('../../../helpers/s3');

// to listen for test payment_intent events on windows
// ./stripe.exe listen --forward-to localhost:5000/stripe/webhooks/handle-payment-intent

module.exports = {
    createPaymentIntent: async (req, res) => {
        try {
            const { items, user } = req.body;
            let meta = {};

            for (let i = 0; i < items.length; i++) {
                const productID = items[i].trackID;
                meta[productID] = items[i].priceID;
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: await calculateOrderAmount(items),
                currency: "usd",
                receipt_email: user,
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
                    const paymentData = event.data.object;
                    let htmlBody = 'Thank you for purchasing my beats! Your files are linked below. These links don\'t last long so download them now! ';
                    htmlBody += 'Don\'t worry too much though - you can always go to my site and get the proper links again!\n\n';
                    for (const [key, price_id] of Object.entries(paymentData.metadata)) {
                        const price = await stripe.prices.retrieve(price_id);
                        const product = await stripe.products.retrieve(price.product);
                        const track = await Track.findOne({stripeProduct: product.id});


                        const taggedGetUrl = await generateUrlHelper("get", { Key: track.taggedVersion });
                        const untaggedGetUrl = await generateUrlHelper("get",  { Key: track.untaggedVersion });
                        const coverArtGetUrl = await generateUrlHelper("get", { Key: track.coverArt });

                        htmlBody += "TAGGED VERSION:\n";
                        htmlBody += taggedGetUrl + " \n\n";
                        htmlBody += "UNTAGGED VERSION:\n";
                        htmlBody += untaggedGetUrl + " \n\n";
                        htmlBody += "COVER ART:\n";
                        htmlBody += coverArtGetUrl + " \n\n";

                        if (price.metadata.name === 'exclusive') {
                            await Track.findOneAndUpdate({ stripeProduct: product.id }, { hasBeenSoldAsExclusive: true });
                            const stemsGetUrl = await generateUrlHelper("get",  { Key: track.stems });
                            htmlBody += "STEMS:\n";
                            htmlBody += stemsGetUrl + " \n";
                        }
                    }

                    transporter.sendMail({
                        from: process.env.EMAIL,
                        to: paymentData.receipt_email,
                        subject: 'Thanks for Purchasing My Beats!',
                        text: htmlBody
                    }, (err, info) => {
                        if (err) console.log({err});
                        else console.log('email sent successfully!', {info});
                    });

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