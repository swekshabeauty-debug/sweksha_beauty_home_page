
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "sweksha-beauty-993b2.firebasestorage.app"
    });
}

const bucket = admin.storage().bucket();

async function listFiles() {
    try {
        console.log('Listing files in bucket...');
        const [files] = await bucket.getFiles({ maxResults: 20 });

        console.log('--- Firebase Storage Files (First 20) ---');
        files.forEach(file => {
            console.log(file.name);
        });
        console.log('-----------------------------------------');
    } catch (e) {
        console.error('Error listing files:', e.message);
    }
}

listFiles();
