'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Loader2, ImagePlus, Calendar, Sparkles, Gift, Phone, ChevronRight } from 'lucide-react';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    services?: SuggestedService[];
    quickActions?: string[];
}
interface SuggestedService {
    name: string;
    price: string;
    categoryId?: string;
}

interface AskSwekshaChatProps {
    customTrigger?: React.ReactNode;
}

// Parse AI response for JSON block
function parseAIResponse(text: string): { cleanText: string; services?: SuggestedService[]; quickActions?: string[] } {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        try {
            const data = JSON.parse(jsonMatch[1]);
            const cleanText = text.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
            return {
                cleanText,
                services: data.suggestedServices,
                quickActions: data.quickActions
            };
        } catch (e) {
            return { cleanText: text };
        }
    }
    return { cleanText: text };
}

// Quick Action Button Component
function QuickActionButton({ action, onClick }: { action: string; onClick: () => void }) {
    const config: Record<string, { icon: React.ReactNode; label: string; href?: string }> = {
        book: { icon: <Calendar className="w-4 h-4" />, label: "Book Now", href: "/booking" },
        viewServices: { icon: <Sparkles className="w-4 h-4" />, label: "View Services", href: "/services" },
        viewOffers: { icon: <Gift className="w-4 h-4" />, label: "View Offers", href: "/offers" },
        viewPackages: { icon: <Gift className="w-4 h-4" />, label: "Packages", href: "/packages" },
        call: { icon: <Phone className="w-4 h-4" />, label: "Call Now", href: "tel:+919065347011" },
    };

    const item = config[action];
    if (!item) return null;

    if (item.href) {
        return (
            <Link
                href={item.href}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 border border-pink-200 dark:border-pink-800 rounded-full text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all"
            >
                {item.icon}
                {item.label}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 border border-pink-200 dark:border-pink-800 rounded-full text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all"
        >
            {item.icon}
            {item.label}
        </button>
    );
}

// Service Card Component
function ServiceCard({ service }: { service: SuggestedService }) {
    return (
        <Link
            href={`/booking?service=${encodeURIComponent(service.name)}`}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-100 dark:border-pink-800 hover:shadow-md transition-all group"
        >
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm group-hover:text-pink-600 transition-colors">{service.name}</p>
                <p className="text-pink-600 dark:text-pink-400 font-bold text-sm">₹{service.price}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                <ChevronRight className="w-4 h-4 text-pink-500 group-hover:text-white transition-colors" />
            </div>
        </Link>
    );
}

export default function AskSwekshaChat({ customTrigger }: AskSwekshaChatProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Namaste! 🙏 Main Ask Sweksha hoon, aapki beauty advisor. Aap mujhse kuch bhi beauty related puch sakte ho!',
            quickActions: ['viewServices', 'book', 'viewOffers']
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedImage]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input + (selectedImage ? ' [Image Attached]' : '')
        };

        setMessages((prev) => [...prev, userMessage]);

        const payload = {
            message: input,
            image: selectedImage,
            history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
            userName: user?.displayName || "Guest"
        };

        setInput('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    const rateLimitMsg: Message = {
                        role: 'assistant',
                        content: data.response || "I'm busy right now. Please try again in 30 seconds."
                    };
                    setMessages((prev) => [...prev, rateLimitMsg]);
                    return;
                }
                throw new Error(data.error || 'Failed to send message');
            }

            // Parse the response for structured data
            const parsed = parseAIResponse(data.response);

            const assistantMessage: Message = {
                role: 'assistant',
                content: parsed.cleanText,
                services: parsed.services,
                quickActions: parsed.quickActions
            };
            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error: any) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: error.message || 'Connection Error (Please Refresh Page)',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const chatWindow = (
        <div className="fixed bottom-6 right-6 z-[9999] w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[85vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/30 dark:border-gray-700 font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl border border-white/30 shadow-inner">
                        💁‍♀️
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Ask Sweksha</h3>
                        <p className="text-xs text-white/80 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Live • Your Beauty Expert
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-2 rounded-full transition duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/50 to-white/50 dark:from-gray-900/50 dark:to-black/50">
                {messages.map((msg, index) => (
                    <div key={index} className="space-y-2">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div
                                className={`max-w-[85%] px-4 py-3 shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl rounded-br-sm'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>

                        {/* Service Cards */}
                        {msg.services && msg.services.length > 0 && (
                            <div className="pl-2 space-y-2 animate-in slide-in-from-bottom-3 fade-in duration-500">
                                <p className="text-xs text-gray-500 font-medium ml-1">💅 Suggested Services:</p>
                                {msg.services.map((service, idx) => (
                                    <ServiceCard key={idx} service={service} />
                                ))}
                            </div>
                        )}

                        {/* Quick Actions */}
                        {msg.quickActions && msg.quickActions.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-2 animate-in slide-in-from-bottom-3 fade-in duration-500 delay-100">
                                {msg.quickActions.map((action, idx) => (
                                    <QuickActionButton key={idx} action={action} onClick={() => { }} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm rounded-bl-sm flex gap-1.5 items-center">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {selectedImage && (
                <div className="px-4 pt-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <div className="relative group">
                        <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-pink-200" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-gray-400">Image attached</span>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-pink-500/30 focus-within:border-pink-500 transition-all duration-300">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/30"
                        title="Upload Photo"
                        disabled={isLoading}
                    >
                        <ImagePlus className="w-5 h-5" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={selectedImage ? "Describe your concern..." : "Ask about beauty treatments..."}
                        className="flex-1 px-2 py-1 bg-transparent focus:outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;

    return (
        <>
            {/* Trigger Button */}
            {!isOpen && (
                customTrigger ? (
                    <div onClick={() => setIsOpen(true)}>
                        {customTrigger}
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group animate-in zoom-in duration-300"
                        aria-label="Ask Sweksha - Beauty Expert"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-12 right-0 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-gray-100 transform translate-y-2 group-hover:translate-y-0">
                            Ask Sweksha 💬
                        </span>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-30"></span>
                    </button>
                )
            )}

            {/* Chat Window (Portaled) */}
            {isOpen && createPortal(chatWindow, document.body)}
        </>
    );
}
