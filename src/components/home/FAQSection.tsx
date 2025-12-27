'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface FAQSectionProps {
    faq: any[];
}

export default function FAQSection({ faq }: FAQSectionProps) {
    return (
        <section className="py-12 px-4 bg-white dark:bg-gray-900">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center font-serif">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faq.map((item, i) => (
                        <FadeIn key={item._id || i} delay={i * 0.1}>
                            <div className="bg-brand-bg/20 dark:bg-gray-800 rounded-xl overflow-hidden">
                                <details className="group">
                                    <summary className="flex justify-between items-center p-4 cursor-pointer list-none font-medium text-gray-800 dark:text-gray-200">
                                        <span>{item.question}</span>
                                        <span className="transition group-open:rotate-180">
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </span>
                                    </summary>
                                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100/50 dark:border-gray-700 pt-2">
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
