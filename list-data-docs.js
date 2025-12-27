
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listDocs() {
    const snapshot = await db.collection('data').get();
    console.log('--- DOCUMENTS IN DATA ---');
    snapshot.docs.forEach(doc => console.log(doc.id));
    console.log('-------------------------');
}

listDocs();
