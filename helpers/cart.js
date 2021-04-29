const Track = require("../api/models/Track");

const { stripe } = require('../config/stripeConfig');

module.exports = {
    calculateOrderAmount: async items => {
        let total = 0;

        for (let i = 0; i < items.length; i++) {
            const { unit_amount } = await stripe.prices.retrieve(items[i].priceID);
            total += unit_amount;
        } 

        return total;
    },
    handlePaymentIntentSucceeded: async paymentIntent => {
        const paymentData = paymentIntent.metadata;
        for (const [key, price_id] of Object.entries(paymentData)) {
            const price = await stripe.prices.retrieve(price_id);

            // if sold as exclusive, mark as sold as exclusive in db
            if (price.metadata.name === 'exclusive') {
                const product = await stripe.products.retrieve(price.product);
                await Track.findOneAndUpdate({ trackName: product.name }, { hasBeenSoldAsExclusive: true});
            }
        }
    }
};