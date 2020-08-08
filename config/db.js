// assign db path and options
const dbPath = "mongodb://localhost/beat-store-db";
const dbOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

module.exports = {
    dbPath,
    dbOpts
};