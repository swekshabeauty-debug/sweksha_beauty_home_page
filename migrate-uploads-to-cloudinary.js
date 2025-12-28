
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

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

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || '677998825295425',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
console.log(`Uploads Dir: ${UPLOADS_DIR}`);

async function uploadToCloudinary(imagePath) {
    // Clean path to get filename: "/uploads/foo.png" -> "foo.png"
    const filename = path.basename(imagePath);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`   [Skip] File not found: ${filename} (Orig: ${imagePath})`);
        return null;
    }

    try {
        console.log(`   Uploading ${filename}...`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'sweksha_beauty',
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });
        return result.secure_url;
    } catch (e) {
        console.error(`   [Error] Upload failed for ${filename}:`, e.message);
        return null;
    }
}

async function migrateServices() {
    console.log('\n--- Migrating Services ---');
    const docRef = db.collection('data').doc('services');
    const doc = await docRef.get();

    if (!doc.exists) return;

    let list = doc.data().list || [];
    let updatedCount = 0;

    for (let i = 0; i < list.length; i++) {
        let s = list[i];
        let changed = false;

        // Check main image
        if (s.image && !s.image.startsWith('http')) {
            console.log(`[Service] Migrating: ${s.name} (${s.image})`);
            const url = await uploadToCloudinary(s.image);
            if (url) {
                console.log(`   -> Success: ${url}`);
                s.image = url;
                changed = true;
            }
        }

        // Check sub-services
        if (s.services) {
            for (let j = 0; j < s.services.length; j++) {
                let sub = s.services[j];
                if (sub.image && !sub.image.startsWith('http')) {
                    console.log(`[Sub] Migrating: ${sub.name} (${sub.image})`);
                    const url = await uploadToCloudinary(sub.image);
                    if (url) {
                        console.log(`   -> Success: ${url}`);
                        sub.image = url;
                        changed = true;
                    }
                }
            }
        }

        if (changed) updatedCount++;
    }

    if (updatedCount > 0) {
        await docRef.set({ list });
        console.log(`Saved ${updatedCount} services with new Cloudinary URLs.`);
    } else {
        console.log("No services needed migration.");
    }
}

async function migrateGallery() {
    console.log('\n--- Migrating Gallery ---');
    const docRef = db.collection('data').doc('gallery');
    const doc = await docRef.get();

    if (!doc.exists) return;

    let list = doc.data().list || [];
    let updatedCount = 0;

    for (let i = 0; i < list.length; i++) {
        let img = list[i];
        if (img.image && !img.image.startsWith('http')) {
            console.log(`[Gallery] Migrating: ${img.title} (${img.image})`);
            const url = await uploadToCloudinary(img.image);
            if (url) {
                console.log(`   -> Success: ${url}`);
                img.image = url;
                updatedCount++;
            }
        }
    }

    if (updatedCount > 0) {
        await docRef.set({ list });
        console.log(`Saved ${updatedCount} gallery items with new Cloudinary URLs.`);
    } else {
        console.log("No gallery items needed migration.");
    }
}

async function run() {
    await migrateServices();
    await migrateGallery();
    console.log("\nMigration Complete!");
}

run();
