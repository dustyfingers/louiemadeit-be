// import models 
const Track = require('../models/Track');

const { generateUrlHelper } = require('../helpers/s3');
const { stripe } = require('../config/stripeConfig');

module.exports = {
    createTrack: async (req, res) => {
        try {
            const stripeTrack = await stripe.products.create({ name: req.body.trackName, metadata: { product_type: 'track' } });

            const leaseStripePriceStems = await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 2999,
                metadata: {
                    name: 'lease'
                }
            });
            
            const leaseStripePriceMaster = await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 4999,
                metadata: {
                    name: 'master'
                }
            });

            const exclusiveStripePrice = await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 14999,
                metadata: {
                    name: 'exclusive'
                }
            });

            const track = await Track.create({ 
                ...req.body, 
                prices: {
                    exclusiveStripePrice: exclusiveStripePrice.id, 
                    leaseStripePriceMaster: leaseStripePriceMaster.id,
                    leaseStripePriceStems: leaseStripePriceStems.id
                },
                stripeProduct: stripeTrack.id 
            });

            res.status(200).send({
                status: 1,
                message: "Track created successfully.",
                data: track
            });
        } catch (err) {
            res.status(400).send({
                status: 0,
                message: "There was an error creating this track.",
                err
            });
        }
    },
    fetchAllCurrentTracks: async (req, res) => {
        try {
            const tracks = await Track.find({ hasBeenSoldAsExclusive: false }).exec();

            if (tracks.length !== 0) {
                // for each track generate the proper track and cover art get urls and attach it to the track object
                for (let i = 0; i < tracks.length; i++) {
                    let taggedVersion = tracks[i].taggedVersion;
                    let coverArt = tracks[i].coverArt;
                    tracks[i].taggedVersionUrl = await generateUrlHelper('get', { Key: taggedVersion});
                    tracks[i].coverArtUrl = await generateUrlHelper('get', { Key: coverArt });
                }

                res.status(200).send({
                    status: 1,
                    message: "Here are the tracks for the shop!",
                    tracks
                });
            } else {
                res.status(200).send({
                    status: 1,
                    message: "There are no shop tracks currently."
                });
            }

        } catch (err) {
            res.status(400).send({
                status: 0,
                message: "There was an error fetching the tracks for the shop.",
                err
            });
        }
    }
};