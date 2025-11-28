import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'AI service is not configured. Please add GEMINI_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Fetch services dynamically
        const services = await getServices();
        const servicesList = services.map((cat: any) => {
            const catServices = cat.services.map((s: any) => `${s.name} (₹${s.price})`).join(', ');
            return `- **${cat.name}:** ${catServices}`;
        }).join('\n');

        // System prompt with Sweksha Beauty context
        const systemPrompt = `You are "Ask Sweksha", an expert beauty advisor for Sweksha Beauty parlour in Haveli Kharagpur, Munger, Bihar. You provide professional beauty advice in both Hindi and English.

**Your Services & Pricing (in INR):**
${servicesList}

**Your Role:**
- Answer beauty-related questions professionally
- Suggest suitable services based on customer needs
- Provide precautions and aftercare tips
- Share natural beauty tips
- Recommend treatments for specific concerns
- Respond in the same language the customer uses (Hindi/English/Hinglish)
- Be friendly, professional, and helpful
- Always mention you're located at Haveli Kharagpur, Munger when relevant

**Important:**
- If asked about pricing, suggest customers call +919065347011 or visit the salon.
- Encourage booking appointments through the website or by calling.
- Don't make medical claims, stick to beauty advice
- Be culturally sensitive and respectful

Answer the customer's question now.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build conversation history
        const chatHistory = history?.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        })) || [];

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Namaste! I am Ask Sweksha, your beauty advisor. How can I help you today?' }],
                },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
