'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Quote, Star } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface TestimonialsProps {
    reviews: any[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
    return (
        <section className="py-16 px-4 bg-brand-bg/30 dark:bg-black/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <Sparkles className="w-full h-full text-brand-primary" />
            </div>
            <div className="container mx-auto max-w-4xl">
                <FadeIn>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-10 text-center font-serif">What Our Clients Say</h2>
                </FadeIn>

                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-3 gap-6 snap-x snap-mandatory hide-scrollbar">
                    {reviews.filter(r => r.active).slice(0, 3).map((review, i) => (
                        <FadeIn key={review._id || i} delay={i * 0.2} className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center h-full">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl relative shadow-sm h-full border border-transparent hover:border-brand-primary/20 transition-colors">
                                <Quote className="w-8 h-8 text-brand-primary/20 absolute top-4 right-4" />
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, starI) => (
                                        <Star key={starI} className={`w-4 h-4 ${starI < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic mb-4 text-sm leading-relaxed">"{review.comment || review.text}"</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold text-xs">
                                        {review.name[0]}
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link href="/reviews" className="inline-block border border-brand-primary text-brand-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-primary hover:text-white transition">
                        Read More Reviews
                    </Link>
                </div>
            </div>
        </section>
    );
}
