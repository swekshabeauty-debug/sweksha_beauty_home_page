
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const serviceAccount = require('./service-account.json');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

async function recover() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Models (Flexible Schema)
        const ServiceModel = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
        const PackageModel = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
        const ReviewModel = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        const TeamModel = mongoose.model('Team', new mongoose.Schema({}, { strict: false }));
        const FAQModel = mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));
        const GalleryModel = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));
        const BookingModel = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        const SettingsModel = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

        console.log('Starting data recovery from Firebase...');

        const collections = [
            { docId: 'services', model: ServiceModel, type: 'list' },
            { docId: 'packages', model: PackageModel, type: 'list' },
            { docId: 'reviews', model: ReviewModel, type: 'list' },
            { docId: 'team', model: TeamModel, type: 'list' },
            { docId: 'faq', model: FAQModel, type: 'list' },
            { docId: 'gallery', model: GalleryModel, type: 'list' },
            { docId: 'bookings', model: BookingModel, type: 'list' },
            { docId: 'offers', model: mongoose.model('Offer', new mongoose.Schema({}, { strict: false })), type: 'list' },
            // Settings/Content are single docs
            { docId: 'settings', model: SettingsModel, type: 'doc', targetType: 'general_settings' },
            { docId: 'content', model: SettingsModel, type: 'doc', targetType: 'site_content' },
        ];

        for (const col of collections) {
            try {
                const docRef = firestore.collection('data').doc(col.docId);
                const docSnap = await docRef.get();

                if (docSnap.exists) {
                    const data = docSnap.data();
                    let items = [];

                    if (col.type === 'list') {
                        // Old structure: { list: [...] }
                        items = data.list || [];

                        if (items.length > 0) {
                            console.log(`Found ${items.length} items in ${col.docId}`);

                            // Debug first item
                            if (items.length > 0) {
                                console.log('First item sample:', JSON.stringify(items[0], null, 2));
                            }

                            // Clear existing (seed) data
                            await col.model.deleteMany({});

                            // Clean data: Ensure IDs exist. If not, generate one.
                            const cleanItems = items.map((item, idx) => {
                                // For Services (Categories), ensure 'id' exists
                                if (col.docId === 'services' && !item.id) {
                                    item.id = `cat_${Date.now()}_${idx}`;
                                    console.warn(`Generated ID for category at index ${idx}`);
                                }
                                // For bookings/others, ensure ID
                                if (!item.id) {
                                    item.id = `${col.docId}_${Date.now()}_${idx}`;
                                }
                                return item;
                            });

                            // Insert recovered data
                            try {
                                await col.model.insertMany(cleanItems, { ordered: false });
                                console.log(`✅ Recovered ${col.docId}`);
                            } catch (insertErr) {
                                console.error(`⚠️ Partial insertion error in ${col.docId}:`, insertErr.message);
                                if (insertErr.insertedDocs) console.log(`   Saved ${insertErr.insertedDocs.length} docs`);
                            }
                        } else {
                            console.log(`⚠️ ${col.docId} document exists but list is empty.`);
                        }

                    } else if (col.type === 'doc') {
                        console.log(`Found document for ${col.docId}`);
                        await col.model.updateOne(
                            { type: col.targetType },
                            { ...data, type: col.targetType },
                            { upsert: true }
                        );
                        console.log(`✅ Recovered ${col.docId}`);
                    }

                } else {
                    console.log(`⚠️ Document ${col.docId} not found in Firebase.`);
                }

            } catch (err) {
                console.error(`❌ Error recovering ${col.docId}:`, err.message);
            }
        }

        console.log('✅ Recovery process complete!');

    } catch (e) {
        console.error('Fatal Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    }
}

recover();
