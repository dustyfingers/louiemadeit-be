<!-- deployed to heroku/mongodb atlas for dev -->
<!-- will probably do the same for prod -->

local setup prerequisites:
nodejs/npm
mongodb

PROJECT SETUP:
step 1:
set up .env file in root project dir with the proper credentials:
AWS_ACCESSKEY=
AWS_ACCESSKEY_ID=
BUCKET_NAME=
BUCKET_REGION=
DB_PATH=mongodb://localhost/name-of-local-test-db
SESSION_SECRET=
STRIPE_SK=
ORIGIN=http://localhost:3000
SAME_SITE=lax

step 2:
npm install in root project dir

step 3:
npm run dev

step 4:
???

step 5:
profit
