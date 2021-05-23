const { stripe } = require('../../../config/stripeConfig');
const { calculateOrderAmount } = require('../../../helpers/cart');
const Track = require("../../models/Track");
const transporter = require('../../../config/nodemailerConfig');
const { generateUrlHelper } = require('../../../helpers/s3');

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
            res.status(400).send({success: 0, message: 'Error while creating payment intent.', error});
        }
    },
    handlePaymentIntent: async (req, res) => {
        try {
            const event = req.body;

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentData = event.data.object;
                    let htmlBody = 'Here are your files. The links don\'t last long so use them soon! ';
                    htmlBody += 'Don\'t worry too much though - you can always go to www.louiemadeit.com, sign in and download your files again from your profile page.\n\n\n';

                    htmlBody += 'Thanks for your support,\n'
                    htmlBody += 'louiemadeit\n\n\n\n\n'
                    
                    for (const [key, price_id] of Object.entries(paymentData.metadata)) {
                        const price = await stripe.prices.retrieve(price_id);
                        const product = await stripe.products.retrieve(price.product);
                        const track = await Track.findOne({stripeProduct: product.id});


                        const taggedGetUrl = await generateUrlHelper("get", { Key: track.taggedVersion });
                        const untaggedGetUrl = await generateUrlHelper("get",  { Key: track.untaggedVersion });
                        const coverArtGetUrl = await generateUrlHelper("get", { Key: track.coverArt });

                        htmlBody += `${track.trackName.toUpperCase()}\n\n`; 

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
                        htmlBody += '\n\n';
                    }

                    transporter.sendMail({
                        from: process.env.EMAIL,
                        to: paymentData.receipt_email,
                        subject: 'Thank You For Purchasing My Beats!',
                        text: htmlBody
                    }, (err, info) => {
                        if (err) console.log({err});
                    });

                    res.status(200).send({ message: "Payment intent handled successfully!"});
                    break;
                    
                default:
                    break;
            }

            res.status(200).send();

        } catch (error) {
            res.status(400).send({success: 0, message: 'Error while handling payment intent.', error})
        }
    },
    fetchPurchasedTracks: async (req, res) => {
        console.log(req);
        const purchasedItems = await stripe.orders.list({ customer: "stripe_id_here" });
        res.status(200).send({ message: "Payment intent handled successfully!", purchasedItems});
    }
};