import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServices, getContent, getFAQ, getOffers } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'AI service is not configured.' },
                { status: 500 }
            );
        }

        const { message, history, image, userName } = await req.json();

        if (!message && !image) {
            return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
        }

        // Fetch context data in parallel
        const [services, content, faq, offers] = await Promise.all([
            getServices(),
            getContent(),
            getFAQ(),
            getOffers()
        ]);

        // Format Services
        const servicesList = services.map((cat: any) => {
            const catServices = cat.services.map((s: any) => `${s.name} (₹${s.price})`).join(', ');
            return `- **${cat.name}:** ${catServices}`;
        }).join('\n');

        // Format FAQ
        const faqList = faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

        // Format Offers
        const offersList = offers.length > 0
            ? offers.map((o: any) => `- ${o.title}: ${o.description} (Code: ${o.code})`).join('\n')
            : "No specific offers currently.";

        // Format About/Contact
        const aboutInfo = content.about ? `
**About Us:** ${content.about.description}
**Our Values:** ${content.about.values?.join(', ')}
` : '';

        // Add User Name Context
        const userContext = userName && userName !== 'Guest'
            ? `\n**User Context:** You are speaking to **${userName}**. Usage their name occasionally to be friendly and personalized.`
            : '';

        const systemPrompt = `You are "Ask Sweksha", an expert beauty advisor for Sweksha Beauty parlour in Haveli Kharagpur, Munger, Bihar. You provide professional beauty advice in both Hindi and English.
You have access to the following real-time information about the salon:
${userContext}

**📍 Location & About:**
${aboutInfo}

**🛠️ Services & Pricing (in INR):**
${servicesList}

**🎁 Current Offers:**
${offersList}

**❓ Frequently Asked Questions:**
${faqList}

**Your Role:**
- Answer user questions using the provided information (FAQ, Services, Offers).
- **Image Analysis**: If the user provides an image, analyze it for skin type, skin concerns (acne, pigmentation, wrinkles, dryness), or hair condition.
- If the answer is in the FAQ, use that information.
- If asked about prices, use the Service list.
- If asked about offers, mention the available codes.
- Be friendly, professional, and helpful.
- **Language Rule**: ALWAYS match the user's language style.
    - If they speak **Hinglish** (Hindi written in English), YOU MUST REPLY IN **HINGLISH**.
    - If they speak English, reply in English.
    - If they speak Hindi, reply in Hindi.
    - Example Hinglish: "Haan, humare paas bridal package hai. Iska price ₹5000 se start hota hai."

**Important:**
- Suggest customers call +919065347011 for bookings if they want to schedule.
- Don't make medical claims.
- Be culturally sensitive.

Answer the customer's question now.`;

        const genAI = new GoogleGenerativeAI(apiKey);

        // Define function to try generation with a specific model
        async function tryGenerate(modelName: string) {
            // console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemPrompt
            });

            // Format history
            const chatHistory = history?.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })) || [];

            const chat = model.startChat({ history: chatHistory });

            if (image) {
                let mimeType = 'image/jpeg';
                let base64Data = image;

                if (typeof image === 'string' && image.startsWith('data:')) {
                    const match = image.match(/^data:([^;]+);base64,(.+)$/);
                    if (match) {
                        mimeType = match[1];
                        base64Data = match[2];
                    } else {
                        base64Data = image.split(',')[1];
                    }
                }

                const imagePart = {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                };
                return await chat.sendMessage([message, imagePart]);
            } else {
                return await chat.sendMessage(message);
            }
        }

        // List of models to try in order
        // 1. "Unlimited" Live models (Priority as requested by user)
        // 2. gemini-2.5-flash: Best quality text model
        // 3. gemini-2.5-flash-lite: High rate limit text model
        // 4. Fallbacks
        const models = [
            "gemini-2.5-flash-native-audio-dialog", // Unlimited model
            "gemini-2.5-flash",                  // Primary fallback
            "gemini-2.5-flash-lite",
            "gemini-2.0-flash",
            "gemini-1.5-flash"
        ];

        let result;
        let lastError;

        for (const modelName of models) {
            try {
                result = await tryGenerate(modelName);
                if (result) break; // If successful, exit loop
            } catch (error: any) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
            }
        }

        if (!result) {
            throw lastError || new Error("All AI models failed to respond. Please try again later.");
        }

        const responseText = result.response.text();
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error('Chat API Error:', error);

        const status = error.status || 500;
        let message = error.message || 'An error occurred while communicating with the AI.';

        if (status === 503) {
            message = "Service overloaded. Please try again in 5-10 seconds.";
        } else if (status === 429) {
            message = "Too many requests. Please wait 1 minute.";
        } else if (message.includes('404')) {
            message = "AI Model not available for your region/key. Please contact support.";
        }

        return NextResponse.json({ error: `AI Error: ${message}` }, { status: status });
    }
}
