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
        return;
    }
};