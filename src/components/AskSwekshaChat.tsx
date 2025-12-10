'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Loader2, ImagePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AskSwekshaChatProps {
    customTrigger?: React.ReactNode;
}

export default function AskSwekshaChat({ customTrigger }: AskSwekshaChatProps) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Namaste! 🙏 Main Ask Sweksha hoon, aapki beauty advisor. Aap mujhse kuch bhi beauty related puch sakte ho! (You can ask me anything about beauty treatments, skincare, hair care, etc.)',
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
        // Note: We don't display the image in chat history for simplicity yet, only text

        setMessages((prev) => [...prev, userMessage]);

        const payload = {
            message: input,
            image: selectedImage, // Send base64 image
            history: messages.slice(1),
            userName: session?.user?.name || "Guest"
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
                // If rate limited, just show the message without throwing a console error
                if (response.status === 429) {
                    const rateLimitMsg: Message = {
                        role: 'assistant',
                        content: data.response || "I'm busy right now. Please try again in 30 seconds."
                    };
                    setMessages((prev) => [...prev, rateLimitMsg]);
                    return; // Exit normally
                }
                throw new Error(data.error || 'Failed to send message');
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
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
        <div className="fixed bottom-6 right-6 z-[9999] w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 font-sans animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl border border-white/30">
                        💁‍♀️
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Ask Sweksha</h3>
                        <p className="text-xs text-white/90 font-medium">Your Beauty Expert</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-1.5 rounded-full transition duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/50 to-white/50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-2.5 shadow-sm ${msg.role === 'user'
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm rounded-bl-none flex gap-1 items-center">
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
                <div className="px-4 pt-2 bg-white/80 backdrop-blur-sm border-t border-gray-100 flex items-center gap-2">
                    <div className="relative group">
                        <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-pink-200" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-md hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-gray-400">Image attached</span>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all duration-300">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
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
                        className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm text-gray-800 placeholder:text-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-2 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
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
                        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group animate-in zoom-in duration-300"
                        aria-label="Ask Sweksha - Beauty Expert"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-12 right-0 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-gray-100 transform translate-y-2 group-hover:translate-y-0">
                            Ask Sweksha 💬
                        </span>
                    </button>
                )
            )}

            {/* Chat Window (Portaled) */}
            {isOpen && createPortal(chatWindow, document.body)}
        </>
    );
}
