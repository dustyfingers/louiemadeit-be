const app = require('../server');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../api/models/User');

const createExampleUser = async () => {
  let exampleUser = { email: 'testymail@example.com' };
  exampleUser.hash = await bcrypt.hash('woohoofakepw123!', 10);
  exampleUser.stripeCustomerId = await bcrypt.hash(exampleUser.email, 10);
  return exampleUser;
}

beforeEach(async done => {
  mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach(done => {
  mongoose.connection.db.dropDatabase(() => 
    mongoose.connection.close(() => done()));
});

test('should create a new user', async () => {
  const response = await request(app)
    .post('/auth/sign-up')
    .send({
      email: 'testemail@email.com',
      password: 'passwordhere123!'
    })
    .expect(200);

  const createdUser = await User.findById(response.body.user.id);
  expect(createdUser).not.toBeNull();
});

test('should not create a user that already exists', async () => {
  // create example user
  const exampleUser = await createExampleUser();
  await new User(exampleUser).save();

  await request(app)
    .post('/auth/sign-up')
    .send({
      email: exampleUser.email,
      password: 'passwordhere123!'
    })
    .expect(400);

  const exampleUserAfter = await User.findOne({email: exampleUser.email});

  // check original user still exists
  expect(exampleUserAfter).not.toBeNull();
  
  // check for original data to match
  expect(exampleUserAfter).toMatchObject(exampleUser);
});