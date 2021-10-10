const { stripe } = require('../config/stripeConfig')
const { calculateOrderAmount } = require('../helpers/cart')
const Track = require("../models/Track")
const Pack = require('../models/Pack')
const transporter = require('../config/nodemailerConfig')
const { generateUrlHelper } = require('../helpers/s3')

module.exports = {
    createPaymentIntent: async (req, res) => {
        try {
            const { stripeCustomerId, email } = req.user
            const { items } = req.body
            let meta = {}

            for (let i = 0; i < items.length; i++) {
                let productID
                if (items[i].trackID) productID = items[i].trackID
                else if (items[i].packID) productID = items[i].packID
                meta[productID] = items[i].priceID
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: await calculateOrderAmount(items),
                customer: stripeCustomerId,
                currency: "usd",
                receipt_email: email,
                metadata: meta
            })
            
            res.status(200).send({
                clientSecret: paymentIntent.client_secret
            })
        } catch (error) {
            res.status(400).send({message: 'Error while creating payment intent.', error})
        }
    },
    handlePaymentIntent: async (req, res) => {
        try {
            const event = req.body

            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentData = event.data.object
                    let htmlBody = 'Here are your files. The links don\'t last long so use them soon! '
                    htmlBody += 'Don\'t worry too much though - you can always go to www.louiemadeit.com, sign in and download your files again from your profile page.\n\n\n'

                    htmlBody += 'Thanks for your support,\n'
                    htmlBody += 'louiemadeit\n\n\n\n\n'
                    
                    for (let price_id of Object.values(paymentData.metadata)) {
                        const price = await stripe.prices.retrieve(price_id)
                        const product = await stripe.products.retrieve(price.product)

                        if (product.metadata.product_type === 'track') {
                            const track = await Track.findOne({stripeProduct: product.id})
                            const taggedGetUrl = await generateUrlHelper("get", { Key: track.taggedVersion })
                            const untaggedGetUrl = await generateUrlHelper("get",  { Key: track.untaggedVersion })
                            const coverArtGetUrl = await generateUrlHelper("get", { Key: track.coverArt })
    
                            htmlBody += `${track.trackName.toUpperCase()}\n\n`
                            htmlBody += "TAGGED VERSION:\n"
                            htmlBody += taggedGetUrl + " \n\n"
                            htmlBody += "UNTAGGED VERSION:\n"
                            htmlBody += untaggedGetUrl + " \n\n"
                            htmlBody += "COVER ART:\n"
                            htmlBody += coverArtGetUrl + " \n\n"
                            if (price.metadata.name === 'exclusive' || price.metadata.name === 'lease') {
                                await Track.findOneAndUpdate({ stripeProduct: product.id }, { hasBeenSoldAsExclusive: true })
                                const stemsGetUrl = await generateUrlHelper("get",  { Key: track.stems })
                                htmlBody += "STEMS:\n"
                                htmlBody += stemsGetUrl + " \n"
                            }
                            htmlBody += '\n\n'
                        } else if (product.metadata.product_type === 'pack') {
                            const pack = await Pack.findOne({stripeProduct: product.id})
                            const zipGetUrl = await generateUrlHelper("get",  { Key: pack.zip })
                            const coverArtGetUrl = await generateUrlHelper("get", { Key: pack.coverArt })

                            htmlBody += `${pack.packName.toUpperCase()}\n\n`
                            htmlBody += "ZIP FILES:\n"
                            htmlBody += zipGetUrl + " \n\n"
                            htmlBody += "COVER ART:\n"
                            htmlBody += coverArtGetUrl + " \n\n"
                            htmlBody += '\n\n'
                        }
                    }

                    transporter.sendMail({
                        from: process.env.EMAIL,
                        to: paymentData.receipt_email,
                        subject: 'Thank You For Purchasing!',
                        text: htmlBody
                    }, (error, info) => { 
                        if (error) console.log({error})
                        htmlBody = 'Woohoo! You made a sale! '
                        htmlBody += 'Someone purchased $' + paymentData.amount / 100 + ' of goods from louiemadeit.com.\n\n\n'
    
                        htmlBody += 'Freakin Cool!\n'
                        htmlBody += 'louiemadeit\n\n\n\n\n'
    
                        transporter.sendMail({
                            from: process.env.EMAIL,
                            to: process.env.SALES_EMAIL,
                            subject: 'Cha Ching! You just made a sale!',
                            text: htmlBody
                        }, (error, info) => { if (error) console.log({error}) })
                    })


                    res.status(200).send({ message: "Payment intent handled successfully!"})
                    break
                    
                default:
                    return
            }

            res.status(200).send()

        } catch (error) {
            res.status(400).send({message: 'Error while handling payment intent.', error})
        }
    },
    fetchPurchases: async (req, res) => {
        try {
            const { stripeCustomerId } = req.user
            const allStripeOrders = await stripe.paymentIntents.list({customer: stripeCustomerId})
            const succeededOrders = allStripeOrders.data.filter(order => order.status === 'succeeded')
            let stripeProductsPurchased = [], purchases = []

            for (let i = 0; i < succeededOrders.length; i++) {
                for (let [product, price] of Object.entries(succeededOrders[i].metadata)) {
                    stripeProductsPurchased.push([product, price])
                }
            }
            
            for (let i = 0; i < stripeProductsPurchased.length; i++) {
                const product = await stripe.products.retrieve(stripeProductsPurchased[i][0])

                if (product.metadata.product_type === 'track') {
                    const track = await Track.find({stripeProduct: product.id})
                    if (track.length) {
                        const { metadata: { name } } = await stripe.prices.retrieve(stripeProductsPurchased[i][1])
                        const trackPurchasedAsExclusive = name === "exclusive"
                        const taggedGetUrl = await generateUrlHelper("get", { Key: track[0].taggedVersion })
                        const untaggedGetUrl = await generateUrlHelper("get",  { Key: track[0].untaggedVersion })
                        const coverArtGetUrl = await generateUrlHelper("get", { Key: track[0].coverArt })
                        const stemsGetUrl = await generateUrlHelper("get", { Key: track[0].stems })
        
                        if (trackPurchasedAsExclusive) purchases.push({trackName: track[0].trackName, taggedGetUrl, untaggedGetUrl, coverArtGetUrl, stemsGetUrl})
                        else if (!purchases.find(purchase => purchase.trackName === track[0].trackName)) purchases.push({trackName: track[0].trackName, taggedGetUrl, untaggedGetUrl, coverArtGetUrl})
                    }
                } else if (product.metadata.product_type === 'pack') {
                    const pack = await Pack.find({stripeProduct: product.id})
                    if (pack.length) {
                        const zipGetUrl = await generateUrlHelper("get", { Key: pack[0].zip })
                        const coverArtGetUrl = await generateUrlHelper("get", { Key: pack[0].coverArt })
                        if (!purchases.find(purchase => purchase.packName === pack[0].packName)) purchases.push({packName: pack[0].packName, coverArtGetUrl, zipGetUrl})
                    }
                }
            }
            res.status(200).send({message: "Purchased tracks fetched successfully!", purchases})
        } catch (error) {
            res.status(400).send({message: 'Error while fetching purchased tracks.', error})
        }
    }
}