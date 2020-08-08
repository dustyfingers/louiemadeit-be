const {
    bucketName,
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

// In order to create pre-signed GET and PUT URLs we use the AWS SDK s3.getSignedUrl method.
// getSignedUrl(operation, params, callback) ⇒ String
// For more information check the AWS documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// PUT URL Generator
function generatePutUrlHelper(Key, ContentType) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key,
            ContentType
        };
        // Note operation in this case is putObject
        s3.getSignedUrl('putObject', params, function (err, url) {
            if (err) {
                reject(err);
            }
            // If there is no errors we can send back the pre-signed PUT URL
            resolve(url);
        });
    });
}

// GET URL Generator
function generateGetUrlHelper(Key) {
    return new Promise((resolve, reject) => {
        const params = {
            bucketName,
            Key,
            Expires: 120 // 2 minutes
        };
        // Note operation in this case is getObject
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                reject(err);
            } else {
                // If there is no errors we will send back the pre-signed GET URL
                resolve(url);
            }
        });
    });
}

module.exports = {
    generatePutUrlHelper,
    generateGetUrlHelper
};