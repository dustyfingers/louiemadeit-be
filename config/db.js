// assign db path and options
const dbPath = process.env.PORT ? "mongodb+srv://dbUser:iZ7XEQlrc02Q9XSE@louiemadeit-testdb.aotsm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority": "mongodb://localhost/beat-store-db";
const dbOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

module.exports = {
    dbPath,
    dbOpts
};