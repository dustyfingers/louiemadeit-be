// import models
const Pack = require('../models/Pack');

const { generateUrlHelper } = require('../helpers/s3');
const { stripe } = require('../config/stripeConfig');

module.exports = {
    createPack: async (req, res) => {
        try {
            const stripePack = await stripe.products.create({
                name: req.body.packName,
                metadata: { product_type: 'pack' },
            });

            const stripePrice = await stripe.prices.create({
                product: stripePack.id,
                currency: 'usd',
                unit_amount: 1999,
            });

            const pack = await Pack.create({
                ...req.body,
                stripePrice: stripePrice.id,
                stripeProduct: stripePack.id,
            });

            res.status(200).send({
                status: 1,
                message: 'Pack created successfully.',
                data: pack,
            });
        } catch (err) {
            res.status(400).send({
                status: 0,
                message: 'There was an error creating this pack.',
                err,
            });
        }
    },
    fetchAllCurrentPacks: async (req, res) => {
        try {
            const packs = await Pack.find().exec();

            if (packs.length) {
                // for each pack generate the proper zip and cover art get urls
                const newPacks = await Promise.all(
                    packs.map(async pack => ({
                        ...pack._doc,
                        coverArtUrl: await generateUrlHelper('get', {
                            Key: pack.coverArt,
                        }),
                        zipUrl: await generateUrlHelper('get', { Key: pack.zip }),
                    }))
                );

                res.status(200).send({
                    status: 1,
                    message: 'Here are the packs for the shop!',
                    packs: newPacks,
                });
            } else {
                res.status(200).send({
                    status: 1,
                    message: 'There are no shop packs currently.',
                });
            }
        } catch (err) {
            res.status(400).send({
                status: 0,
                message: 'There was an error fetching the packs for the shop.',
                err,
            });
        }
    },
};
