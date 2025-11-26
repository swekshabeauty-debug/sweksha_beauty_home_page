const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAqGEAXpQ9xa6nxPg_wZud_sZ-eIjhnDc8",
    authDomain: "sweksha-beauty-993b2.firebaseapp.com",
    projectId: "sweksha-beauty-993b2",
    storageBucket: "sweksha-beauty-993b2.firebasestorage.app",
    messagingSenderId: "700157745460",
    appId: "1:700157745460:web:df83d4a645872b48aaad61",
    measurementId: "G-65HEVYRL0S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DATA_DIR = path.join(__dirname, 'src', 'data');

async function migrate() {
    console.log('Starting migration...');

    const files = [
        { name: 'services.json', docId: 'services', type: 'list' },
        { name: 'packages.json', docId: 'packages', type: 'list' },
        { name: 'offers.json', docId: 'offers', type: 'list' },
        { name: 'bookings.json', docId: 'bookings', type: 'list' },
        { name: 'reviews.json', docId: 'reviews', type: 'list' },
        { name: 'team.json', docId: 'team', type: 'list' },
        { name: 'gallery.json', docId: 'gallery', type: 'list' },
        { name: 'settings.json', docId: 'settings', type: 'doc' },
        { name: 'content.json', docId: 'content', type: 'doc' },
    ];

    for (const file of files) {
        try {
            const filePath = path.join(DATA_DIR, file.name);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);

                if (file.type === 'list') {
                    await setDoc(doc(db, 'data', file.docId), { list: data });
                } else {
                    await setDoc(doc(db, 'data', file.docId), data);
                }
                console.log(`✅ Migrated ${file.name}`);
            } else {
                console.log(`⚠️ File not found: ${file.name}`);
            }
        } catch (error) {
            console.error(`❌ Error migrating ${file.name}:`, error);
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrate();
