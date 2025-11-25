'use client';

import { useState, useEffect } from 'react';
import { Trash2, Check, X, Star } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const res = await fetch('/api/data/reviews');
        const data = await res.json();
        setReviews(data);
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const updatedReviews = reviews.map(r => r.id === id ? { ...r, active: !currentStatus } : r);

        await fetch('/api/data/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedReviews),
        });

        setReviews(updatedReviews);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this review?')) return;
        const updatedReviews = reviews.filter(r => r.id !== id);

        await fetch('/api/data/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedReviews),
        });

        setReviews(updatedReviews);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Reviews</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className={`bg-white p-6 rounded-lg shadow-sm border ${review.active ? 'border-green-200' : 'border-yellow-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">{review.name}</h3>
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleStatus(review.id, review.active)}
                                    className={`p-1.5 rounded-full ${review.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                    title={review.active ? 'Hide Review' : 'Approve Review'}
                                >
                                    {review.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                </button>
                                <button onClick={() => handleDelete(review.id)} className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">"{review.text}"</p>
                        <div className="mt-4 text-xs text-gray-400">
                            Status: {review.active ? 'Visible' : 'Hidden'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
