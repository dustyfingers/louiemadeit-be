// import models 
const Track = require("../../models/Track");

module.exports = {
    createTrack: async (req, res) => {
        // pull props off of request
        const {
            email
        } = req.body;

        // create the track
        try {
            console.log("this track wants to be created!");
            const responseBody = {
                status: 1,
                message: "This is happening!",
                data: req.body
            };
            res.status(200).send(responseBody);

            // connect to s3 bucket, and upload all rich media

            // if all uploads are successful
            // save urls to mongodnb doc

        } catch (err) {
            const responseBody = {
                status: 0,
                message: "There was an error creating this track.",
                err
            };
            res.status(400).send(responseBody);
        }
    }
};