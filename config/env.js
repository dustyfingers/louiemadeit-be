// stripe api key, db path
let localDbPath, localStripeApiKey, origin, sameSite, secure = false;

if (!process.env.DEV && !process.env.PROD) {
    origin = "http://localhost:3000";
    localDbPath = "mongodb://localhost/beat-store-db";
    localStripeApiKey = "sk_test_51Iay6NLYNexBDWiNT5pyxAFU0fepSkd8Mt8cdgXycHDZENhuJxbc8s3O2H9ZF6bTYWDtR7WvEqM54B8QULj9Varb00rMrMax9Y";
    sameSite = "lax";
}
else if (process.env.DEV) {
    origin = "https://dev.louiemadeit.com";
    sameSite = "none";
    secure = true;
}
else if (process.env.PROD) {
    origin = "https://www.louiemadeit.com";
    sameSite = "none";
    secure = true;
}

module.exports = {
    bucketRegion: process.env.BUCKET_REGION || "us-east-2",
    awsAccessKeyId: process.env.AWS_ACCESSKEY_ID || "AKIAY7ZEYML4HLTQAQXU",
    awsAccessKey: process.env.AWS_ACCESSKEY || "yR2dR6DtHpWQ7zonseVrXflTFnNjp+yfdY4f29Jk",
    stripe_sk: process.env.STRIPE_SK || localStripeApiKey,
    jwtSecret: process.env.JWT_SECRET || "long_random_stringfdASDFI=0QAWET982=RT09324FWASDNA;KCNaz",
    bucketName: process.env.BUCKET_NAME || "beetz",
    sessionSecret: process.env.SESSION_SECRET || "local(development>session-cookie_signing_keysfdjgbaolrt4",
    dbPath: process.env.DB_PATH || localDbPath,
    origin,
    sameSite,
    secure
};