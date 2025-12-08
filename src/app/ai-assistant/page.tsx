'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'model';
    content: string;
    image?: string;
}

export default function AiAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: 'Namaste! I am "Ask Sweksha", your personal beauty advisor. You can ask me about skincare, haircare, or our services. You can also upload a photo for a quick analysis!'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size too large. Please upload an image smaller than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            image: selectedImage || undefined
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        const currentImage = selectedImage; // Store for API call
        setSelectedImage(null); // Clear UI preview
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    image: currentImage,
                    history: messages.filter(m => !m.image).map(m => ({ // Don't send full base64 history to save bandwidth/tokens for now
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'model', content: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: 'I apologize, but I encountered an error providing advice. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-4">

                {/* Header */}
                <div className="bg-white p-6 rounded-t-2xl shadow-sm border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-primary/10 p-2 rounded-lg">
                            <Cpu className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Ask Sweksha AI</h1>
                            <p className="text-sm text-gray-500">Your Personal Beauty Advisor</p>
                        </div>
                    </div>

                    <div className="hidden md:block text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                        Powered by Gemini AI
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white border-x border-gray-100 overflow-y-auto min-h-[500px] max-h-[70vh] p-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-brand-primary text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.image && (
                                        <div className="mb-3 rounded-lg overflow-hidden">
                                            <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-60 object-cover" />
                                        </div>
                                    )}
                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'text-gray-800'}`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl p-4 rounded-bl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-4 rounded-b-2xl shadow-sm border-t border-gray-100">

                    {/* Image Preview */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 relative inline-block"
                            >
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 w-24 h-24">
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-gray-500 hover:text-brand-primary hover:bg-gray-50 rounded-xl transition border border-gray-200"
                            title="Upload Image for Analysis"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about skin, hair, or our services..."
                            className="flex-1 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-brand-primary/20"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400">
                            AI can make mistakes. Please consult with our specialists for professional medical advice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
