// import models 
const Track = require("../../models/Track");

const { generateUrlHelper } = require("../../../helpers/s3");
const { stripe } = require("../../../config/stripeConfig");

module.exports = {
    createTrack: async (req, res) => {
        try {
            const stripeTrack = await stripe.products.create({ name: req.body.trackName });

            await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 2999,
                metadata: {
                    name: 'lease'
                }
            });
            await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 4999,
                metadata: {
                    name: 'master'
                }
            });

            await stripe.prices.create({
                product: stripeTrack.id,
                currency: "usd",
                unit_amount: 4999,
                metadata: {
                    name: 'exclusive'
                }
            });

            const track = await Track.create({ ...req.body, stripeProduct: stripeTrack.id });

            res.status(200).send({
                status: 1,
                message: "Track created successfully.",
                data: track
            });
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error creating this track.",
                err
            };
            res.status(400).send(responseBody);
        }
    },
    fetchAllCurrentTracks: async (req, res) => {
        try {
            const tracks = await Track.find();

            // for each track generate the proper track and cover art get urls and attach it to the track object
            for (let i = 0; i < tracks.length; i++) {
                let taggedVersion = tracks[i].taggedVersion;
                let coverArt = tracks[i].coverArt;
                tracks[i].taggedVersionUrl = false || await generateUrlHelper('get', { Key: taggedVersion});
                tracks[i].coverArtUrl = false || await generateUrlHelper('get', { Key: coverArt });
            }

            res.status(200).send({
                status: 1,
                message: "Here are the tracks for the shop!",
                tracks
            });
        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error fetching the tracks for the shop.",
                err
            };
            res.status(400).send(responseBody);
        }
    }
};