'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface FAQSectionProps {
    faq: Array<{
        _id?: string;
        question: string;
        answer: string;
    }>;
}

export default function FAQSection({ faq }: FAQSectionProps) {
    return (
        <section className="py-12 px-4 bg-background">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center font-serif">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faq.map((item, i) => (
                        <FadeIn key={item._id || i} delay={i * 0.1}>
                            <div className="card-elegant overflow-hidden">
                                <details className="group">
                                    <summary className="flex justify-between items-center gap-4 p-4 cursor-pointer list-none font-medium text-foreground">
                                        <span>{item.question}</span>
                                        <span className="transition group-open:rotate-180">
                                            <ChevronDown className="w-5 h-5 text-muted" />
                                        </span>
                                    </summary>
                                    <div className="px-4 pb-4 text-muted text-sm leading-relaxed border-t border-brand-primary/10 pt-2">
                                        {item.answer}
                                    </div>
                                </details>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
