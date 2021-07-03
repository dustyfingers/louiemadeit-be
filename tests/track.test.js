const app = require('../server');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const User = require('../api/models/User');
const Track = require('../api/models/Track');

let exampleUser = { email: 'testymail@example.com' };
const exampleUserPassword = 'woohoofakepw123!';

beforeAll(async done => {
    mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true }, () => done());

    exampleUser.hash = await bcrypt.hash(exampleUserPassword, 10);
    exampleUser.stripeCustomerId = await bcrypt.hash(exampleUser.email, 10);
    await new User(exampleUser).save();
});

afterAll(done => {
    mongoose.connection.db.dropDatabase(() => 
        mongoose.connection.close(() => done()));
});

const exampleTrack = {
    trackName: 'example track #23424545778',
    taggedVersion: 'example tagged file.wav',
    untaggedVersion: 'example untagged file.wav',
    stems: 'example stems.zip',
    coverArt: 'example cover art.jpg',
}

test('signed in admin should be able to upload files to aws s3', async () => {
    const s3GenPutUrl = '/s3/generate-put-url';

    // ? check out the handleUploadToS3 function for help maybe?
    // const response = await request(app)
        // post()
        // .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        // .send()
        // .expect(200)
});

test('signed in admin should be able to create track', async () => {
    await request(app)
        .post('/track/new')
        .send(exampleTrack)
        .expect(200);
    
    const track = Track.findOne({ trackName: exampleTrack.trackName });
    expect(track).not.toBeNull();
});

test('non admin should not be able to create track', async () => {

    const response = request(app)
        .post('/track/new')
        // ? .set() ?
        .send({

        })
        .expect(401);
});