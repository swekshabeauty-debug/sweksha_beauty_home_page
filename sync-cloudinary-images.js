
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase
try {
    const serviceAccount = require('./service-account.json');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (e) {
    console.error("Failed to init firebase:", e.message);
    process.exit(1);
}

const db = admin.firestore();

// Load Cloudinary Mapping
let cloudinaryImages = [];
try {
    const rawData = fs.readFileSync('./cloudinary_all_images.json', 'utf8');
    cloudinaryImages = JSON.parse(rawData);
    console.log(`Loaded ${cloudinaryImages.length} Cloudinary images.`);
} catch (e) {
    console.error("Failed to load cloudinary_all_images.json:", e.message);
    process.exit(1);
}

// Helper query function
function findCloudinaryUrl(filename) {
    if (!filename) return null;

    // Normalize filename (remove path, remove extension if needed, though mapping has extension)
    const cleanName = filename.split('/').pop().split('?')[0];

    // Try exact match first
    let match = cloudinaryImages.find(img => img.filename === cleanName);

    // Try match without extension if failed
    if (!match) {
        const nameNoExt = cleanName.split('.')[0];
        match = cloudinaryImages.find(img => img.filename === nameNoExt);
    }

    // Try fuzzy match (public_id contains name)
    if (!match) {
        match = cloudinaryImages.find(img => img.public_id.includes(cleanName.split('.')[0]));
    }

    return match ? match.url : null;
}

async function syncServices() {
    console.log('\n--- Syncing Services ---');
    const docRef = db.collection('data').doc('services');
    const doc = await docRef.get();

    if (!doc.exists) return;

    let list = doc.data().list || [];
    let updatedCount = 0;

    list = list.map(s => {
        let changed = false;

        // Check main image
        const cUrl = findCloudinaryUrl(s.image);
        if (cUrl && s.image !== cUrl) {
            console.log(`Updated Service [${s.name}]: ${s.image} -> ${cUrl}`);
            s.image = cUrl;
            changed = true;
        }

        // Check sub-services
        if (s.services) {
            s.services = s.services.map(sub => {
                const subUrl = findCloudinaryUrl(sub.image);
                if (subUrl && sub.image !== subUrl) {
                    console.log(`  Updated Sub-Service [${sub.name}]: ${sub.image} -> ${subUrl}`);
                    sub.image = subUrl;
                    changed = true;
                }
                return sub;
            });
        }

        if (changed) updatedCount++;
        return s;
    });

    if (updatedCount > 0) {
        await docRef.set({ list });
        console.log(`Saved ${updatedCount} services with new Cloudinary URLs.`);
    } else {
        console.log("No services needed updates.");
    }
}

async function syncGallery() {
    console.log('\n--- Syncing Gallery ---');
    const docRef = db.collection('data').doc('gallery');
    const doc = await docRef.get();

    if (!doc.exists) return;

    let list = doc.data().list || [];
    let updatedCount = 0;

    list = list.map(img => {
        const cUrl = findCloudinaryUrl(img.image);
        if (cUrl && img.image !== cUrl) {
            console.log(`Updated Gallery [${img.title}]: ${img.image} -> ${cUrl}`);
            img.image = cUrl;
            updatedCount++;
        }
        return img;
    });

    if (updatedCount > 0) {
        await docRef.set({ list });
        console.log(`Saved ${updatedCount} gallery items with new Cloudinary URLs.`);
    } else {
        console.log("No gallery items needed updates.");
    }
}

async function run() {
    await syncServices();
    await syncGallery();
    console.log("\nSync Complete!");
}

run();
