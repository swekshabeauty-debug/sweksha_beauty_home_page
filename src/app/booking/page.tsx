'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, CheckCircle, Tag, Percent } from 'lucide-react';

import { useAuth } from '@/components/AuthProvider';
import GoogleSignInButton from '@/components/GoogleSignInButton';

function BookingForm() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const preselectedPackage = searchParams.get('package');
    const preselectedService = searchParams.get('service');
    const preselectedOffer = searchParams.get('offer');
    const discountPercent = parseInt(searchParams.get('discount') || '0');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceCategory: '',
        service: '',
        originalPrice: 0,
        price: 0,
        discount: discountPercent,
        package: preselectedPackage || '',
        offer: preselectedOffer || '',
        date: '',
        time: '',
        notes: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    useEffect(() => {
        fetch('/api/data/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);

                // If there's a preselected service, find its category and set both
                if (preselectedService) {
                    for (const category of data) {
                        const foundService = category.services.find((s: any) => s.name === preselectedService);
                        if (foundService) {
                            const originalPrice = foundService.price || 0;
                            const discountedPrice = discountPercent > 0
                                ? Math.round(originalPrice * (1 - discountPercent / 100))
                                : originalPrice;

                            setFormData(prev => ({
                                ...prev,
                                serviceCategory: category.name,
                                service: preselectedService,
                                originalPrice: originalPrice,
                                price: discountedPrice,
                                discount: discountPercent
                            }));
                            break;
                        }
                    }
                }

                setLoading(false);
            });
    }, [preselectedService, discountPercent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                // Reset form
                setFormData({ name: '', email: '', phone: '', serviceCategory: '', service: '', originalPrice: 0, price: 0, discount: 0, package: '', offer: '', date: '', time: '', notes: '' });
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Error submitting booking.');
        } finally {
            setSubmitting(false);
        }
    };

    // Apply discount when service changes
    const handleServiceChange = (serviceName: string) => {
        const selectedService = availableServices.find((s: any) => s.name === serviceName);
        const originalPrice = selectedService?.price || 0;
        const discountedPrice = formData.discount > 0
            ? Math.round(originalPrice * (1 - formData.discount / 100))
            : originalPrice;

        setFormData({
            ...formData,
            service: serviceName,
            originalPrice: originalPrice,
            price: discountedPrice
        });
    };

    const availableServices = formData.serviceCategory
        ? services.find(c => c.name === formData.serviceCategory)?.services || []
        : [];


    if (loading) return <div>Loading...</div>;

    if (success) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Request Received!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for choosing Sweksha Beauty. We have received your request and will confirm your appointment shortly via WhatsApp or Call.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-brand-primary font-medium hover:underline"
                >
                    Book Another Appointment
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-secondary/20 text-center">
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Sign In to Book</h2>
                <p className="text-gray-600 mb-8">Please sign in with your Google account to book an appointment. This helps us confirm your booking and send you updates.</p>
                <div className="flex justify-center">
                    <GoogleSignInButton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-secondary/20">
            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Book Your Appointment</h2>

            {/* Auth Info */}
            <div className="mb-8">
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                    {user?.photoURL && (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                        </>
                    )}
                    <div>
                        <p className="text-green-800 font-medium">Welcome, {user?.displayName}!</p>
                        <p className="text-green-600 text-xs">Booking as {user?.email}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                            placeholder="Enter your full name"
                        />
                    </div>
                    {/* Email field removed - using session email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (10 digits)</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            pattern="[6-9]\d{9}"
                            maxLength={10}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                            placeholder="Ex: 9876543210"
                            title="Please enter a valid 10-digit mobile number starting with 6-9"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 10-digit number</p>
                    </div>
                </div>

                {!formData.package && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                            <select
                                value={formData.serviceCategory}
                                onChange={e => setFormData({ ...formData, serviceCategory: e.target.value, service: '', price: 0 })}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                            >
                                <option value="">Select Category</option>
                                {services.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Service</label>
                            <select
                                value={formData.service}
                                onChange={e => handleServiceChange(e.target.value)}
                                disabled={!formData.serviceCategory}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none disabled:bg-gray-50"
                            >
                                <option value="">Select Service</option>
                                {availableServices.map((s: { id: string; name: string; price: number }) => (
                                    <option key={s.id} value={s.name}>{s.name} (₹{s.price})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {formData.offer && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Tag className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-gray-900">{formData.offer}</p>
                                    {formData.discount > 0 && (
                                        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                            {formData.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                {formData.service && formData.discount > 0 && (
                                    <p className="text-sm">
                                        <span className="text-gray-500 line-through">₹{formData.originalPrice}</span>
                                        <span className="text-green-600 font-bold ml-2">₹{formData.price}</span>
                                        <span className="text-green-600 ml-1 text-xs">You save ₹{formData.originalPrice - formData.price}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, offer: '', discount: 0 })}
                            className="text-xs text-gray-500 hover:text-red-500 underline"
                        >
                            Remove
                        </button>
                    </div>
                )}

                {formData.package && (
                    <div className="bg-brand-bg p-4 rounded-lg border border-brand-secondary/20 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-brand-primary font-medium">Selected Package</p>
                            <p className="font-bold text-gray-900">{formData.package}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, package: '' })}
                            className="text-xs text-gray-500 hover:text-red-500 underline"
                        >
                            Change
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <select
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                            >
                                <option value="">Select Time Slot</option>
                                {(() => {
                                    const timeSlots = [
                                        "10:00 AM - 12:00 PM",
                                        "12:00 PM - 02:00 PM",
                                        "02:00 PM - 04:00 PM",
                                        "04:00 PM - 06:00 PM",
                                        "06:00 PM - 07:30 PM"
                                    ];

                                    const getAvailableTimeSlots = () => {
                                        if (!formData.date) return timeSlots;

                                        const today = new Date();
                                        const selectedDate = new Date(formData.date);

                                        // Reset hours to compare just the dates
                                        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                        const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

                                        if (checkDate.getTime() === todayDate.getTime()) {
                                            const currentHour = today.getHours();
                                            return timeSlots.filter(slot => {
                                                const startTime = slot.split(' - ')[0]; // e.g., "10:00 AM"
                                                let [time, period] = startTime.split(' ');
                                                let [hours, minutes] = time.split(':').map(Number);

                                                if (period === 'PM' && hours !== 12) hours += 12;
                                                if (period === 'AM' && hours === 12) hours = 0;

                                                // Allow booking if the slot hasn't started yet (or maybe give a 1 hour buffer?)
                                                // Let's say if it's 1:30 PM (13:30), 12:00 PM slot (12) is gone.
                                                // 2:00 PM slot (14) is available.
                                                return hours > currentHour;
                                            });
                                        }
                                        return timeSlots;
                                    };

                                    return getAvailableTimeSlots().map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ));
                                })()}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                        rows={3}
                        placeholder="Any specific requests or allergies?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting Request...' : 'Confirm Booking Request'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Payment accepted in parlour by Cash or UPI. No online payment required.
                </p>
            </form>
        </div >
    );
}

export default function BookingPage() {
    return (
        <div className="bg-brand-bg min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-gray-600">Schedule your visit and let us take care of the rest.</p>
                </div>
                <Suspense fallback={<div>Loading form...</div>}>
                    <BookingForm />
                </Suspense>
            </div>
        </div>
    );
}
