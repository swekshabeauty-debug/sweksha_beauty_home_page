import { getBookings, getServices, getReviews } from '@/lib/db';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const bookings = await getBookings();
    const services = await getServices();
    const reviews = await getReviews();

    // Calculate stats
    const totalBookings = bookings.length;
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((b: any) => b.date === today).length;
    const pendingReviews = reviews.filter((r: any) => !r.active).length;

    const stats = [
        { label: "Today's Bookings", value: todayBookings, icon: Clock, color: 'bg-blue-500' },
        { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-brand-primary' },
        { label: 'Pending Reviews', value: pendingReviews, icon: CheckCircle, color: 'bg-yellow-500' },
        { label: 'Total Services', value: services.reduce((acc: number, cat: any) => acc + cat.services.length, 0), icon: TrendingUp, color: 'bg-green-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-full text-white`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
                        <Link href="/admin/bookings" className="text-brand-primary text-sm hover:underline">View All</Link>
                    </div>
                    {bookings.length === 0 ? (
                        <p className="text-gray-500 text-sm">No bookings yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {bookings.slice(0, 5).map((booking: any, i: number) => (
                                <li key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{booking.name}</p>
                                        <p className="text-xs text-gray-500">{booking.service} • {booking.date}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status || 'New'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/services" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                            <span className="block font-medium text-gray-700">Manage Services</span>
                        </Link>
                        <Link href="/admin/bookings" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                            <span className="block font-medium text-gray-700">View Bookings</span>
                        </Link>
                        <Link href="/admin/offers" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                            <span className="block font-medium text-gray-700">Create Offer</span>
                        </Link>
                        <Link href="/admin/gallery" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                            <span className="block font-medium text-gray-700">Upload Photos</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
