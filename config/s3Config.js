// * this file sets up an s3 instance
const {
    bucketRegion,
    awsAccessKeyId,
    awsAccessKey
} = require("../config/secrets");
const AWS = require('aws-sdk'); // Requiring AWS SDK.

// Configuring AWS
AWS.config = new AWS.Config({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsAccessKey,
    region: bucketRegion
});

// Creating a S3 instance
const s3 = new AWS.S3();

module.exports = {
    s3
};