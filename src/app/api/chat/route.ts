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

        const { message, history, image } = await req.json();

        if (!message && !image) {
            return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
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
- Answer beauty-related questions professionally.
- **Image Analysis**: If the user provides an image, analyze it for skin type, skin concerns (acne, pigmentation, wrinkles, dryness), or hair condition.
- Recommend suitable services from the provided list based on your analysis or the user's question.
- Provide precautions and aftercare tips.
- Share natural beauty tips.
- Respond in the same language the customer uses (Hindi/English/Hinglish).
- Be friendly, professional, and helpful.
- Always mention you're located at Haveli Kharagpur, Munger when relevant.

**Important:**
- If asked about pricing, suggest customers call +919065347011 or visit the salon.
- Encourage booking appointments through the website or by calling.
- Don't make medical claims, stick to beauty advice.
- Be culturally sensitive and respectful.

Answer the customer's question now.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build conversation history
        const chatHistory = history?.map((msg: any) => {
            const parts = [{ text: msg.content }];
            // Note: History with images sends text representation mainly, or previous image analysis context.
            // Simplified for now to text history. complex multimodal history needs proper formatting.
            return {
                role: msg.role === 'user' ? 'user' : 'model',
                parts: parts,
            };
        }) || [];

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

        const parts: any[] = [];
        if (message) {
            parts.push({ text: message });
        }
        if (image) {
            // image is expected to be base64 string without data prefix if possible, or handle stripping
            const base64Data = image.split(',')[1] || image;
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming jpeg/png, gemini handles common formats
                    data: base64Data
                }
            });
        }

        const result = await chat.sendMessage(parts);
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
