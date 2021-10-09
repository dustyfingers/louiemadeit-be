// import models 
const Pack = require('../models/Pack')

const { generateUrlHelper } = require('../helpers/s3')
const { stripe } = require('../config/stripeConfig')

module.exports = {
    createPack: async (req, res) => {
        try {
            const stripePack = await stripe.products.create({ name: req.body.packName })

            await stripe.prices.create({
                product: stripePack.id,
                currency: 'usd',
                unit_amount: 1999
            })

            const pack = await Pack.create({ 
                ...req.body,
                stripeProduct: stripePack.id 
            })

            res.status(200).send({
                status: 1,
                message: 'Pack created successfully.',
                data: pack
            })
        } catch (err) {
            res.status(400).send({
                status: 0,
                message: 'There was an error creating this pack.',
                err
            })
        }
    },
    fetchAllCurrentPacks: async (req, res) => {
        try {
            const packs = await Pack.find().exec()

            if (packs.length !== 0) {
                // for each pack generate the proper pack and cover art get urls and attach it to the pack object
                for (let i = 0; i < packs.length; i++) {
                    let taggedVersion = packs[i].taggedVersion
                    let coverArt = packs[i].coverArt
                    packs[i].taggedVersionUrl = await generateUrlHelper('get', { Key: taggedVersion})
                    packs[i].coverArtUrl = await generateUrlHelper('get', { Key: coverArt })
                }

                res.status(200).send({
                    status: 1,
                    message: 'Here are the packs for the shop!',
                    packs
                })
            } else {
                res.status(200).send({
                    status: 1,
                    message: 'There are no shop packs currently.'
                })
            }

        } catch (err) {
            res.status(400).send({
                status: 0,
                message: 'There was an error fetching the packs for the shop.',
                err
            })
        }
    }
}