import dbConnect from './mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import Package from '@/models/Package';
import Review from '@/models/Review';
import Team from '@/models/Team';
import Gallery from '@/models/Gallery';
import FAQ from '@/models/FAQ';

// Helper to ensure connection
async function connect() {
    return await dbConnect();
}

// ----------------------------------------------------------------------
// Bookings
// ----------------------------------------------------------------------

export async function getBookings() {
    if (!await connect()) return [];
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(bookings));
}

export async function createBooking(data: any) {
    await connect();
    const newBooking = new Booking(data);
    await newBooking.save();
    return {
        ...newBooking.toObject(),
        _id: newBooking._id.toString(),
    };
}

export async function updateBooking(id: string, data: any) {
    await connect();
    // Assuming 'id' is our custom UUID, not _id
    const updated = await Booking.findOneAndUpdate({ id }, data, { new: true }).lean();
    return updated;
}

/**
 * @deprecated Use createBooking for new bookings. This is kept for compatibility but does nothing or could be mapped to bulk write.
 */
export async function saveBookings(data: any[]) {
    // This was used to save the entire list. 
    // In MongoDB, we don't save the entire list at once usually.
    // We could implement a bulk overwrite if really needed, but it's dangerous.
    console.warn('saveBookings is deprecated in MongoDB mode');
    return;
}

// ----------------------------------------------------------------------
// Services
// ----------------------------------------------------------------------

export async function getServices() {
    if (!await connect()) return [];
    const services = await Service.find({}).lean();
    return JSON.parse(JSON.stringify(services));
}

export async function saveServices(data: any[]) {
    await connect();
    // For admin usage - replace all services
    await Service.deleteMany({});
    await Service.insertMany(data);
}

// ----------------------------------------------------------------------
// Packages
// ----------------------------------------------------------------------

export async function getPackages() {
    if (!await connect()) return [];
    const packages = await Package.find({}).lean();
    return JSON.parse(JSON.stringify(packages));
}

export async function savePackages(data: any[]) {
    await connect();
    await Package.deleteMany({});
    await Package.insertMany(data);
}

// ----------------------------------------------------------------------
// Offers (Note: No specific model created yet, reusing Package logic or new model if needed. 
// Assuming offers might be services or packages with discount, but for now let's map to 'Package' or create a generic 'Offer' collection if strict)
// For now, I'll create a simple Offer model inline or assume it shares structure. 
// Let's create a generic 'Data' collection for things like settings/content if they are unique documents.
// But for lists like Offers, let's assume they are handled similar to packages.
// actually, I missed creating an Offer model. Let's assume it's like a Package.
// To be safe, let's create a schema for generic "Offer" here or just use a dynamic collection.
// Let's use a dynamic approach for offers for now using mongoose.connection.db
// OR better, let's create an Offer model quickly.
// I'll stick to a generic "Offer" model concept here.
// ----------------------------------------------------------------------

// Quick Schema for Offer to allow compiling
import mongoose from 'mongoose';
const OfferSchema = new mongoose.Schema({}, { strict: false });
const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);

export async function getOffers() {
    if (!await connect()) return [];
    const offers = await Offer.find({}).lean();
    return JSON.parse(JSON.stringify(offers));
}

export async function saveOffers(data: any[]) {
    await connect();
    await Offer.deleteMany({});
    await Offer.insertMany(data);
}

// ----------------------------------------------------------------------
// Reviews
// ----------------------------------------------------------------------

export async function getReviews() {
    if (!await connect()) return [];
    const reviews = await Review.find({}).lean();
    return JSON.parse(JSON.stringify(reviews));
}

export async function saveReviews(data: any[]) {
    await connect();
    await Review.deleteMany({});
    await Review.insertMany(data);
}

// ----------------------------------------------------------------------
// Team
// ----------------------------------------------------------------------

export async function getTeam() {
    if (!await connect()) return [];
    const team = await Team.find({}).lean();
    return JSON.parse(JSON.stringify(team));
}

export async function saveTeam(data: any[]) {
    await connect();
    await Team.deleteMany({});
    await Team.insertMany(data);
}

// ----------------------------------------------------------------------
// Gallery
// ----------------------------------------------------------------------

export async function getGallery() {
    if (!await connect()) return [];
    const gallery = await Gallery.find({}).sort({ id: -1 }).lean();
    return JSON.parse(JSON.stringify(gallery));
}

export async function saveGallery(data: any[]) {
    await connect();
    await Gallery.deleteMany({});
    await Gallery.insertMany(data);
}

// ----------------------------------------------------------------------
// FAQ
// ----------------------------------------------------------------------

export async function getFAQ() {
    if (!await connect()) return [];
    const faq = await FAQ.find({}).lean();
    return JSON.parse(JSON.stringify(faq));
}

export async function saveFAQ(data: any[]) {
    await connect();
    await FAQ.deleteMany({});
    await FAQ.insertMany(data);
}

// ----------------------------------------------------------------------
// Settings & Content (Single Documents)
// ----------------------------------------------------------------------

// Generic schema for single-doc settings
const SettingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export async function getSettings() {
    await connect();
    const settings = await Settings.findOne({ type: 'general_settings' }).lean();
    if (!settings) return {};
    return JSON.parse(JSON.stringify(settings));
}

export async function saveSettings(data: any) {
    await connect();
    await Settings.updateOne({ type: 'general_settings' }, { ...data, type: 'general_settings' }, { upsert: true });
}

const DEFAULT_CONTENT = {
    home: {
        heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        subtitle: '– Radiance Awaits You',
        highlights: [
            'Experienced beauticians',
            'Hygienic & comfortable ambience',
            'Quality products only'
        ]
    },
    about: {
        title: 'Experience Beauty & Relaxation',
        description: 'At Sweksha Beauty, we believe that beauty is not just about looking good, but feeling good. Our expert team is dedicated to providing you with the best services in a hygienic and relaxing environment.',
        image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        values: [
            'Customer Satisfaction First',
            'Premium Quality Products',
            'Hygiene & Safety Standards',
            'Experienced Professionals'
        ]
    },
    contact: {
        email: 'info@swekshabeauty.com',
        phone: '+919065347011',
        address: 'Main Market, Haveli Kharagpur, Bihar 811213'
    }
};

export async function getContent() {
    if (!await connect()) return DEFAULT_CONTENT;
    try {
        const content = await Settings.findOne({ type: 'site_content' }).lean();
        if (!content) return DEFAULT_CONTENT;
        return { ...DEFAULT_CONTENT, ...JSON.parse(JSON.stringify(content)) };
    } catch (e) {
        return DEFAULT_CONTENT;
    }
}

export async function saveContent(data: any) {
    await connect();
    await Settings.updateOne({ type: 'site_content' }, { ...data, type: 'site_content' }, { upsert: true });
}

