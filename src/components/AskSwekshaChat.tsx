'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, ImagePlus, Calendar, Sparkles, Gift, Phone, ChevronRight } from 'lucide-react';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { formatCurrency } from '@/lib/utils';

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
        } catch {
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
                className="flex items-center gap-2 px-3 py-1.5 bg-card-bg border border-brand-primary/20 rounded-full text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-all"
            >
                {item.icon}
                {item.label}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-card-bg border border-brand-primary/20 rounded-full text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition-all"
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
            className="flex items-center justify-between p-3 bg-surface-soft rounded-lg border border-brand-primary/15 hover:shadow-md transition-all group"
        >
            <div>
                <p className="font-medium text-foreground text-sm group-hover:text-brand-primary transition-colors">{service.name}</p>
                <p className="text-brand-primary font-bold text-sm">{formatCurrency(service.price)}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                <ChevronRight className="w-4 h-4 text-brand-primary group-hover:text-white transition-colors" />
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
            content: 'Namaste! Main Ask Sweksha hoon, aapki beauty advisor. Aap mujhse beauty treatments, offers, packages, ya booking ke baare mein puch sakte ho.',
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

        } catch (error: unknown) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'Connection error. Please refresh the page and try again.';
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: message,
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
        <div className="fixed inset-x-0 bottom-0 z-[9999] h-[min(86svh,640px)] w-full sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:h-[600px] sm:max-h-[85vh] bg-card-bg backdrop-blur-xl rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col overflow-hidden border border-brand-primary/15 font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-accent))] text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/18 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 shadow-inner">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="hidden">
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
                    aria-label="Close Ask Sweksha chat"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-brand-secondary/35 to-background/80">
                {messages.map((msg, index) => (
                    <div key={index} className="space-y-2">
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div
                                className={`max-w-[85%] px-4 py-3 shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg'
                                    : 'bg-card-bg text-foreground border border-brand-primary/10 rounded-lg'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>

                        {/* Service Cards */}
                        {msg.services && msg.services.length > 0 && (
                            <div className="pl-2 space-y-2 animate-in slide-in-from-bottom-3 fade-in duration-500">
                                <p className="text-xs text-muted font-medium ml-1">Suggested Services</p>
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
                        <div className="bg-card-bg border border-brand-primary/10 rounded-lg px-4 py-3 shadow-sm flex gap-1.5 items-center">
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {selectedImage && (
                <div className="px-4 pt-2 bg-card-bg backdrop-blur-sm border-t border-brand-primary/10 flex items-center gap-2">
                    <div className="relative group">
                        <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-brand-primary/25" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-brand-accent text-white rounded-full p-1 shadow-md hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Remove selected image"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-muted">Image attached</span>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-card-bg backdrop-blur-sm border-t border-brand-primary/10 safe-area-bottom">
                <div className="flex gap-2 items-center bg-background border border-brand-primary/15 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-brand-primary/30 focus-within:border-brand-primary transition-all duration-300">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-muted hover:text-brand-primary transition-colors rounded-full hover:bg-brand-primary/10"
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
                        onKeyDown={handleKeyPress}
                        placeholder={selectedImage ? "Describe your concern..." : "Ask about beauty treatments..."}
                        className="flex-1 px-2 py-1 bg-transparent focus:outline-none text-sm text-foreground placeholder:text-muted"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="bg-gradient-to-r from-brand-primary to-brand-accent text-white p-2.5 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
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
                        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-brand-primary to-brand-accent text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group animate-in zoom-in duration-300"
                        aria-label="Ask Sweksha - Beauty Expert"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-12 right-0 bg-card-bg text-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-brand-primary/10 transform translate-y-2 group-hover:translate-y-0">
                            Ask Sweksha 💬
                        </span>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-30"></span>
                    </button>
                )
            )}

            {/* Chat Window (Portaled) */}
            {isOpen && createPortal(chatWindow, document.body)}
        </>
    );
}
