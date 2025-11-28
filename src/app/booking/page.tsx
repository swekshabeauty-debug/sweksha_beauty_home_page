'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

import { useSession } from 'next-auth/react';
import GoogleSignInButton from '@/components/GoogleSignInButton';

function BookingForm() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const preselectedPackage = searchParams.get('package');
    const preselectedService = searchParams.get('service');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceCategory: '',
        service: '',
        price: 0,
        package: preselectedPackage || '',
        date: '',
        time: '',
        notes: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user?.name || prev.name,
                email: session.user?.email || prev.email,
            }));
        }
    }, [session]);

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
                            setFormData(prev => ({
                                ...prev,
                                serviceCategory: category.name,
                                service: preselectedService,
                                price: foundService.price || 0
                            }));
                            break;
                        }
                    }
                }

                setLoading(false);
            });
    }, [preselectedService]);

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
                setFormData({ name: '', email: '', phone: '', serviceCategory: '', service: '', price: 0, package: '', date: '', time: '', notes: '' });
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Error submitting booking.');
        } finally {
            setSubmitting(false);
        }
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

    if (!session) {
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
                    {session.user?.image && (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={session.user.image} alt={session.user.name || 'User'} className="w-10 h-10 rounded-full" />
                        </>
                    )}
                    <div>
                        <p className="text-green-800 font-medium">Welcome, {session.user?.name}!</p>
                        <p className="text-green-600 text-xs">Booking as {session.user?.email}</p>
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
                                onChange={e => {
                                    const selectedService = availableServices.find((s: any) => s.name === e.target.value);
                                    setFormData({
                                        ...formData,
                                        service: e.target.value,
                                        price: selectedService ? selectedService.price : 0
                                    });
                                }}
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
                                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                <option value="06:00 PM - 07:30 PM">06:00 PM - 07:30 PM</option>
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
