import { getReviews } from '@/lib/db';
import { Star, MessageSquare } from 'lucide-react';

export default async function ReviewsPage() {
    const reviews = await getReviews();
    const activeReviews = reviews.filter((r: any) => r.active);

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-brand-bg py-16 text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Client Love</h1>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    Read what our beautiful clients have to say about their experience.
                </p>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {activeReviews.map((review: any, index: number) => (
                        <div key={review.id || `review-${index}`} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                            <div className="absolute -top-4 left-8 bg-brand-primary text-white p-2 rounded-lg shadow-sm">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="flex text-yellow-400 mb-4 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-6 leading-relaxed">"{review.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                    {review.name.charAt(0)}
                                </div>
                                <p className="font-bold text-gray-900">{review.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold font-serif mb-4">Loved our service?</h2>
                    <p className="text-gray-400 mb-8">Share your experience with us on WhatsApp or Google. Your feedback helps us grow!</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://wa.me/919065347011"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition"
                        >
                            Review on WhatsApp
                        </a>
                        <a
                            href="https://share.google/tUJHz3CbGBlVYsa25" // Assuming this is the maps link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                        >
                            Review on Google
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
