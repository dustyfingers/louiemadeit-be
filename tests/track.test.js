const app = require('../server')
const mongoose = require('mongoose')
const request = require('supertest')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Track = require('../models/Track')

const exampleAdminUser = { 
    email: 'adminmail@example.com', 
    password: 'woohoofakepw123',
    isAdmin: true
}

const exampleNonAdminUser = {
    email: 'usermail@example.com', 
    password: 'woohoofakepw123!!',
    isAdmin: false
}

const exampleTrack = {
    trackName: 'example track #23424545778',
    taggedVersion: 'example tagged file.wav',
    untaggedVersion: 'example untagged file.wav',
    stems: 'example stems.zip',
    coverArt: 'example cover art.jpg',
}

beforeAll(async () => {
    await mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: false });
  
    exampleAdminUser.hash = await bcrypt.hash(exampleAdminUser.password, 10)
    exampleAdminUser.stripeCustomerId = await bcrypt.hash(exampleAdminUser.email, 10)

    exampleNonAdminUser.hash = await bcrypt.hash(exampleNonAdminUser.password, 10)
    exampleNonAdminUser.stripeCustomerId = await bcrypt.hash(exampleNonAdminUser.email, 10)

    await new User(exampleAdminUser).save();
    await new User(exampleNonAdminUser).save();
});

afterAll(done => {
    mongoose.connection.db.dropDatabase(() => 
        mongoose.connection.close(() => done()))
})

test('signed in admin should be able to create tracks', async () => {
    let session = null

    const response = await request(app)
        .post('/auth/sign-in')
        .send({
            email: exampleAdminUser.email,
            password: exampleAdminUser.password
        })
        .expect(200)
    session = response.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]).join(';')

    await request(app)
        .post('/tracks/new')
        .set('Cookie', session)
        .send(exampleTrack)
        .expect(200)
    
    const track = await Track.findOne({ trackName: exampleTrack.trackName })
    expect(track).not.toBeNull()
})

test('non admin should not be able to create tracks', async () => {
    let session = null

    const response = await request(app)
        .post('/auth/sign-in')
        .send({
            email: exampleNonAdminUser.email,
            password: exampleNonAdminUser.password
        })
        .expect(200)
    session = response.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]).join(';')

    await request(app)
        .post('/tracks/new')
        .set('Cookie', session)
        .send(exampleTrack)
        .expect(401)
})

test('unauthenticated users should not be able to create tracks', async () => {
    await request(app)
        .post('/tracks/new')
        .send(exampleTrack)
        .expect(401)
})