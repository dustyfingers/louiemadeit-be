const {
    generatePutUrlHelper,
    generateGetUrlHelper
} = require("../../../helpers/s3");

module.exports = {
    generatePutUrl: async (req, res) => {
        const {
            Key,
            ContentType
        } = req.query;

        const putUrl = await generatePutUrlHelper(Key, ContentType);

        putUrl ? res.send({
            putUrl
        }) : res.send({
            err: "There was an error"
        });
    },
    generateGetUrl: (req, res) => {
        console.log(req);
    }
};