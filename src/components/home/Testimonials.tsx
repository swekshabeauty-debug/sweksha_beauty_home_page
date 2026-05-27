'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, Star } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface TestimonialsProps {
    reviews: Array<{
        _id?: string;
        active?: boolean;
        rating?: number;
        comment?: string;
        text?: string;
        name?: string;
    }>;
}

export default function Testimonials({ reviews }: TestimonialsProps) {
    return (
        <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-surface-soft/70 dark:bg-black/30">

            <div className="container mx-auto max-w-6xl">
                <FadeIn>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-brand-primary/10 text-brand-primary mb-4">
                            <Quote className="w-6 h-6" />
                        </div>
                        <h2 className="heading-elegant text-3xl md:text-5xl text-foreground mb-4">Love Stories</h2>
                        <p className="text-muted text-lg max-w-2xl mx-auto">
                            Hear from our cherished clients about their transformative experiences
                        </p>
                    </div>
                </FadeIn>

                <div className="flex overflow-x-auto pb-10 -mx-4 px-4 md:grid md:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar">
                    {reviews.filter(r => r.active).slice(0, 3).map((review, i) => (
                        <FadeIn key={review._id || i} delay={i * 0.2} className="min-w-[300px] snap-center h-full">
                            <div className="card-elegant p-6 md:p-8 relative h-full flex flex-col shadow-soft hover:shadow-elegant transition-all duration-300 group">
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                                    <Quote className="w-5 h-5 fill-current" />
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, starI) => (
                                        <Star key={starI} className={`w-4 h-4 ${starI < (review.rating ?? 5) ? 'text-brand-primary fill-brand-primary' : 'text-gray-300 dark:text-gray-700'}`} />
                                    ))}
                                </div>

                                <blockquote className="text-foreground/80 text-base md:text-lg leading-relaxed italic mb-8 flex-grow font-light">
                                    &ldquo;{review.comment || review.text}&rdquo;
                                </blockquote>

                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-brand-primary/10 dark:border-white/5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {review.name?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-base">{review.name || 'Sweksha Client'}</p>
                                        <p className="text-xs text-muted">Verified Client</p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/reviews" className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-foreground/10 hover:border-brand-primary text-foreground hover:text-white hover:bg-brand-primary transition-all duration-300 font-medium">
                        Read All Love Stories
                    </Link>
                </div>
            </div>
        </section>
    );
}
