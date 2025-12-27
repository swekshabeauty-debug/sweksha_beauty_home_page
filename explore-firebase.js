
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function explore() {
    try {
        console.log('--- Exploring Firebase Firestore ---');

        // List Root Collections
        const collections = await db.listCollections();
        console.log(`Found ${collections.length} root collections.`);

        for (const col of collections) {
            console.log(`\n📂 Collection: [${col.id}]`);
            const docs = await col.listDocuments();
            console.log(`   - Contains ${docs.length} documents.`);

            // Print first few doc IDs to see what they are
            for (let i = 0; i < Math.min(docs.length, 10); i++) {
                const doc = docs[i];
                console.log(`   📄 ${doc.id}`);
                // Peek at content of first one to see structure match
                if (i === 0) {
                    const snap = await doc.get();
                    const data = snap.data();
                    const keys = Object.keys(data);
                    console.log(`      Keys: ${keys.join(', ')}`);
                    if (data.list) console.log(`      Structure: 'list' with ${data.list.length} items`);
                }
            }
        }

        console.log('\n------------------------------------');

    } catch (e) {
        console.error('Exploration failed:', e);
    }
}

explore();
