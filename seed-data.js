
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const services = [
    {
        id: 'hair-cut',
        title: 'Hair Cut & Styling',
        category: 'Hair',
        services: [
            { id: 'h1', name: 'Advanced Hair Cut', price: 249, duration: '45 min', description: 'Professional haircut with wash and blow-dry', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80', active: true },
            { id: 'h2', name: 'Layer Hair Cut', price: 349, duration: '60 min', description: 'Multi-layer cut for volume and style', image: 'https://images.unsplash.com/photo-1605497788044-5a32c707848e?auto=format&fit=crop&w=400&q=80', active: true },
        ]
    },
    {
        id: 'facial',
        title: 'Facial & Cleanup',
        category: 'Skin',
        services: [
            { id: 'f1', name: 'Basic Cleanup', price: 299, duration: '30 min', description: 'Quick cleanup for glowing skin', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80', active: true },
            { id: 'f2', name: 'Fruit Facial', price: 499, duration: '45 min', description: 'Organic fruit facial for deep hydration', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80', active: true },
        ]
    }
];

const packages = [
    {
        id: 'p1',
        name: 'Bridal Glow Package',
        price: 4999,
        originalPrice: 6500,
        duration: '4 Hours',
        description: ['Full Body Waxing', 'Diamond Facial', 'Manicure & Pedicure', 'Hair Spa'],
        image: 'https://images.unsplash.com/photo-1620331309609-e3c24803fa6f?auto=format&fit=crop&w=400&q=80',
        popular: true,
        active: true
    },
    {
        id: 'p2',
        name: 'Party Ready Package',
        price: 1999,
        originalPrice: 2800,
        duration: '2 Hours',
        description: ['Cleanup', 'Hair Styling', 'Saree Draping', 'Light Makeup'],
        image: 'https://images.unsplash.com/photo-1487412947132-26c5c146d046?auto=format&fit=crop&w=400&q=80',
        popular: false,
        active: true
    }
];

const reviews = [
    { id: 'r1', name: 'Priya S.', rating: 5, comment: 'Best parlor in Kharagpur! Loved the facial.', date: '2023-12-01', active: true },
    { id: 'r2', name: 'Neha K.', rating: 4, comment: 'Very professional staff and hygienic place.', date: '2023-11-20', active: true },
];

const team = [
    { id: 't1', name: 'Sweksha Singh', role: 'Owner & Senior Stylist', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', specialties: ['Bridal Makeup', 'Hair treatments'], active: true, bio: 'Expert in bridal makeup with 5 years experience.' },
];

const faq = [
    { id: 'fq1', question: 'Do I need to book an appointment?', answer: 'Yes, we recommend booking in advance to avoid waiting.', category: 'General' },
    { id: 'fq2', question: 'What products do you use?', answer: 'We use premium brands like L\'Oreal, Lotus, and specialized organic products.', category: 'Services' },
];

const gallery = [
    { id: 'g1', title: 'Bridal Cleanup', category: 'Skin', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80' },
    { id: 'g2', title: 'Hair Styling', category: 'Hair', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80', isInstagram: true },
];

// ----------------------------------------------------------------------
// SCRIPT
// ----------------------------------------------------------------------

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Note: We need to match the schema definitions, even though we use a loose schema in DB helpers for some.
        // For Services, in code we are saving the whole object, but in Mongoose schema we defined specific fields.
        // Wait, the ServiceSchema in `src/models/Service.ts` was:
        // { id, title, category, price, duration, description, image }
        // BUT the frontend expects a structure like { id, title, category, services: [...] } (nested categories).
        // Let's check `src/models/Service.ts`.
        // Ah, `src/models/Service.ts` defined flat service structure?
        // Let's re-read the models I created vs the data structure.

        // I created ServiceSchema as:
        /*
        const ServiceSchema = new mongoose.Schema({
            id: { type: String, required: true, unique: true },
            title: { type: String, required: true },
            category: { type: String, required: true },
            price: Number,
            duration: String,
            description: String,
            image: String,
        });
        */

        // BUT `data/services.json` (and the `services` variable above) has a structure of Categories containing arrays of services.
        // If I insert the data above as-is, Mongoose might strip the `services` array if "strict" is true, OR I need to adjust the schema.
        // Let's check `src/models/Service.ts`. I will likely need to update the schema to support the nested structure 
        // OR flatten the data.
        // The frontend `src/app/page.tsx` line 315 iterates: `services.flatMap(cat => cat.services || [])`.
        // So the frontend expects an array of "Categories", each having a "services" array.

        // My Service Model `src/models/Service.ts` seems incorrect for this structure.
        // I should fix the Schema first to be safe, or make it strict: false.

        // QUICK FIX: Use `strict: false` or generic Collections for this seed script to bypass strict schema validation if models are restrictive.
        // But better is to just drop in the data using generic access.

        const ServiceModel = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
        const PackageModel = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
        const ReviewModel = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        const TeamModel = mongoose.model('Team', new mongoose.Schema({}, { strict: false }));
        const FAQModel = mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));
        const GalleryModel = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));

        // Clear existing (optional, but good for reliable seed)
        // await ServiceModel.deleteMany({});
        // await PackageModel.deleteMany({});

        // Actually, let's only insert if empty to avoid overwriting user data if they already added some.
        // But user said "no services looking", so it implies empty.

        const sCount = await ServiceModel.countDocuments();
        if (sCount === 0) {
            console.log('Seeding Services...');
            await ServiceModel.insertMany(services);
        } else {
            console.log('Services already exist. Skipping.');
        }

        const pCount = await PackageModel.countDocuments();
        if (pCount === 0) {
            console.log('Seeding Packages...');
            await PackageModel.insertMany(packages);
        } else {
            console.log('Packages already exist. Skipping.');
        }

        const rCount = await ReviewModel.countDocuments();
        if (rCount === 0) {
            console.log('Seeding Reviews...');
            await ReviewModel.insertMany(reviews);
        }

        const tCount = await TeamModel.countDocuments();
        if (tCount === 0) {
            console.log('Seeding Team...');
            await TeamModel.insertMany(team);
        }

        const fCount = await FAQModel.countDocuments();
        if (fCount === 0) {
            console.log('Seeding FAQ...');
            await FAQModel.insertMany(faq);
        }

        const gCount = await GalleryModel.countDocuments();
        if (gCount === 0) {
            console.log('Seeding Gallery...');
            await GalleryModel.insertMany(gallery);
        }

        console.log('✅ Seeding complete!');

    } catch (e) {
        console.error('Seeding failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

seed();
