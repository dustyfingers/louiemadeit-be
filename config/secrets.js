// secrets, keys, etc go in here
// TODO: replace stripeTest keys with proper ones for this app
module.exports = {
    jwtSecret: process.env.JWT_SECRET ||
        "aoneforallwgehdjtfukyrutybehindwalrusilyiulrandallforoneujeyvirusrhg",
    environment: process.env.DB_ENV || process.env.NODE_ENV || "development",
    stripeTest_pk: "pk_test_NrG1xO2xS4A129Vw93TLLiXf00CMgtpMOru",
    stripeTest_sk: "sk_test_TtYVtJNQOZZofaAVXFK5SAZN00djgJlttu",
    s3BucketName: "beeetz"
};

// AWS access key id
// AKIAIJTHAZ5E274JVKRQ
// AWS access key
// wviIM/oarxv7NFbASrOHysUQLnzdBZAke6j5UmcK