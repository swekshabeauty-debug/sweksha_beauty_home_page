'use client';

import { useState, useEffect } from 'react';
import { Check, X, Search, Filter, MessageCircle } from 'lucide-react';

export default function BookingsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            const res = await fetch('/api/data/bookings');
            const data = await res.json();
            setBookings(data.reverse());
            setLoading(false);
        };
        fetchBookings();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateStatus = async (booking: any, status: string) => {
        if (status === 'Confirmed') {
            // Use the specific confirmation API to trigger email
            try {
                const res = await fetch(`/api/bookings/confirm/${booking.id}?format=json`);
                if (!res.ok) throw new Error('Failed to confirm');

                // Update local state
                const updatedBookings = bookings.map(b =>
                    b.id === booking.id ? { ...b, status: 'Confirmed', confirmedAt: new Date().toISOString() } : b
                );
                setBookings(updatedBookings);
                alert('Booking confirmed and email sent to customer!');
            } catch (error) {
                alert('Error confirming booking');
                console.error(error);
            }
            return;
        }

        // For other statuses, just update the data
        const updatedBookings = bookings.map(b =>
            b.id === booking.id ? { ...b, status } : b
        );

        await fetch('/api/data/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBookings.reverse()),
        });

        setBookings(updatedBookings);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendWhatsApp = (booking: any) => {
        const upiLink = `upi://pay?pa=jayant.kgp81@oksbi&pn=SwekshaBeauty&am=${booking.price || 0}&cu=INR`;
        const message = `Hello ${booking.name}, your booking for ${booking.service} on ${booking.date} at ${booking.time} is CONFIRMED!
Total Amount: ₹${booking.price || 0}

Pay Advance via UPI: ${upiLink}
Or pay at the shop.

See you soon at Sweksha Beauty! ✨`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/91${booking.phone}?text=${encodedMessage}`, '_blank');
    };

    const deleteBooking = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        const updatedBookings = bookings.filter(b => b.id !== id);

        await fetch('/api/data/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBookings.reverse()),
        });

        setBookings(updatedBookings);
    };

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'All' || (filter === 'New' ? (!b.status || b.status === 'New') : b.status === filter);
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.service.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-brand-bg text-brand-primary'; // New
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Manage Appointments</h1>
                <p className="text-gray-500">View and manage all your customer bookings here.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customer or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                    />
                </div>

                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    {['All', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === f
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slot</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking, index) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{booking.name}</div>
                                                    <div className="text-xs text-gray-500">{booking.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {booking.serviceCategory || 'General'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                                            {booking.package && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-bg text-brand-primary mt-1">
                                                    {booking.package}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{booking.date}</div>
                                            <div className="text-xs text-gray-500">{booking.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(booking.status || 'New')}`}>
                                                {booking.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {(!booking.status || booking.status === 'New') && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking, 'Confirmed')}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking, 'Cancelled')}
                                                            className="p-1 text-gray-400 hover:text-red-600 transition"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'Confirmed' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => sendWhatsApp(booking)}
                                                            className="px-3 py-1 bg-[#25D366] text-white text-xs font-medium rounded hover:bg-[#128C7E] transition flex items-center gap-1"
                                                            title="Send Confirmation WhatsApp"
                                                        >
                                                            <MessageCircle className="w-3 h-3" /> WhatsApp
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking, 'Completed')}
                                                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                                                        >
                                                            Complete
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'Completed' && (
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Check className="w-3 h-3" /> Done
                                                        </span>
                                                        <button
                                                            onClick={() => deleteBooking(booking.id)}
                                                            className="p-1 text-gray-400 hover:text-red-600 transition"
                                                            title="Delete Booking"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {/* Also allow deleting cancelled bookings */}
                                                {booking.status === 'Cancelled' && (
                                                    <button
                                                        onClick={() => deleteBooking(booking.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition"
                                                        title="Delete Booking"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
