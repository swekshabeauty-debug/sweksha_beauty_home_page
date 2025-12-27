
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listCols() {
    const cols = await db.listCollections();
    console.log('--- COLLECTIONS ---');
    cols.forEach(c => console.log(c.id));
    console.log('-------------------');
}

listCols();
