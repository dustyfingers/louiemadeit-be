// import libs
const AWS = require('aws-sdk');

// import bucket name
const {
    s3BucketName
} = require("../config/secrets");

module.exports = {
    uploadAudioFileToS3: (audio, fileName, fileType) => {
        // Setting up S3 upload parameters
        const uploadParams = {
            Bucket: s3BucketName,
            Key: `${fileName}.${fileType}`,
            Body: audio
        };

        // Uploading files to the bucket
        s3.upload(uploadParams, (err, data) => {
            if (err) throw err;
            console.log(`File uploaded successfully. ${data.Location}`);
        });
    }
};