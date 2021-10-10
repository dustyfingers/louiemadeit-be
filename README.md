## local setup prerequisites:

nodejs/npm
mongodb
stripe.exe downloaded

## PROJECT SETUP:

# step 1:

navigate to project dir

# step 2:

set up dev.env and test.env files in the config/env/ dir with the proper credentials:
AWS_ACCESSKEY=
AWS_ACCESSKEY_ID=
BUCKET_NAME=
BUCKET_REGION=
DB_PATH=mongodb://localhost/name-of-local-dev-or-test-db-here
SESSION_SECRET=
STRIPE_SK=
ORIGIN=http://localhost:3000
SAME_SITE=lax
EMAIL=
EMAIL_PASSWORD=
SALES_EMAIL=

# step 3:

run 'npm install'

# step 4:

run 'npm run dev'

# step 5 - to listen for test payment_intent events on windows, run this where stripe is downloaded

./stripe.exe listen --forward-to localhost:5000/stripe/webhooks/handle-payment-intent
