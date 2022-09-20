const { bucketName } = require('../config/env');
const { s3 } = require('../config/s3Config');

// In order to create pre-signed GET and PUT URLs we use the AWS SDK s3.getSignedUrl method.
// getSignedUrl(operation, params, callback) ⇒ String
// For more information check the AWS documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// this function generates us all of our s3 urls!
const generateUrlHelper = (type, opts) => {
    return new Promise((resolve, reject) => {
        if (type === 'get') {
            const { Key } = opts;
            const params = {
                Bucket: bucketName,
                Key,
                Expires: 21600, // 6 hours
            };
            // Note operation in this case is getObject
            s3.getSignedUrl('getObject', params, (err, url) => {
                if (err) reject(err);
                // If no errors, send back the pre-signed GET URL
                resolve(url);
            });
        } else if (type === 'put') {
            const { Key, ContentType } = opts;
            const params = {
                Bucket: bucketName,
                Key,
                ContentType,
            };
            // Note operation in this case is putObject
            s3.getSignedUrl('putObject', params, function (err, url) {
                if (err) reject(err);
                // If no errors, send back the pre-signed PUT URL
                resolve(url);
            });
        }
    });
};

module.exports = {
    generateUrlHelper,
};
