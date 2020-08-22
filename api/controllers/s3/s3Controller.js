const {
    generateUrlHelper
} = require("../../../helpers/s3");

module.exports = {
    generatePutUrl: async (req, res) => {
        const {
            Key,
            ContentType
        } = req.query;

        const putUrl = await generateUrlHelper("put", {
            Key,
            ContentType
        });

        putUrl ? res.send({
            putUrl
        }) : res.send({
            err: "There was an error"
        });
    },
    generateGetUrl: async (req, res) => {
        const {
            Key
        } = req.query;
        console.log(Key);
        const getUrl = await generateUrlHelper("get", {
            Key
        });

        console.log(getUrl);

        getUrl ? res.send({
            getUrl
        }) : res.send({
            err: "There was an error"
        });
    }
};