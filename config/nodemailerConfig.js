const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
