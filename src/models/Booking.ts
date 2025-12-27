
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    serviceCategory: {
        type: String,
    },
    service: {
        type: String,
        default: 'Package Booking',
    },
    price: {
        type: Number,
        default: 0,
    },
    package: {
        type: String,
    },
    date: {
        type: String,
        required: [true, 'Please provide a date'],
    },
    time: {
        type: String,
        required: [true, 'Please provide a time'],
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        default: 'New',
    },
    paymentStatus: {
        type: String,
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        default: 'cash',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
