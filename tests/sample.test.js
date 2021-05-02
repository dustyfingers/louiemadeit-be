const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
  mongoose.connect(process.env.DB_PATH,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

describe('Sample Test', () => {
    it('should test that true === true', () => expect(true).toBe(true));
});