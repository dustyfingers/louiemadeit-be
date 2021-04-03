// import models 
const Track = require("../../models/Track");

module.exports = {
    createTrack: async (req, res) => {
        try {
            const track = await Track.create(req.body);

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
    },
    fetchSingleTrack: async (req, res) => {}
};