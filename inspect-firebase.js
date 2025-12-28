
const admin = require('firebase-admin');

// Initialize with the keys directly to avoid any env complications for this debug script
try {
    const serviceAccount = require('./service-account.json');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (e) {
    console.error("Failed to init firebase:", e.message);
}

const db = admin.firestore();

async function inspect() {
    try {
        console.log('\n--- Checking Services ---');
        const servicesDoc = await db.collection('data').doc('services').get();
        if (servicesDoc.exists) {
            const list = servicesDoc.data().list || [];
            console.log(`Found ${list.length} services.`);
            list.slice(0, 5).forEach((s, i) => {
                console.log(`[${i}] ${s.name || s.title}`);
                // Check sub-services if category
                if (s.services) {
                    s.services.slice(0, 2).forEach(sub => {
                        console.log(`   - ${sub.name}: '${sub.image}'`);
                    });
                } else {
                    console.log(`   - Image: '${s.image}'`);
                }
            });
        } else {
            console.log("Services doc not found.");
        }

        console.log('\n--- Checking Gallery ---');
        const galleryDoc = await db.collection('data').doc('gallery').get();
        if (galleryDoc.exists) {
            const list = galleryDoc.data().list || [];
            console.log(`Found ${list.length} gallery items.`);
            list.filter(g => g.category === 'Hair').slice(0, 5).forEach(img => {
                console.log(`- [${img.category}] ${img.title}: '${img.image}'`);
            });
        } else {
            console.log("Gallery doc not found.");
        }

    } catch (e) {
        console.error(e);
    }
}

inspect();
