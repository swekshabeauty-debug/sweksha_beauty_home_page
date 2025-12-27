import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServices, getContent, getFAQ, getOffers, getPackages } from '@/lib/db';

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
        const [services, content, faq, offers, packages] = await Promise.all([
            getServices(),
            getContent(),
            getFAQ(),
            getOffers(),
            getPackages()
        ]);

        // Format Services
        const servicesList = services.map((cat: any) => {
            const catServices = cat.services.map((s: any) => `${s.name} (₹${s.price})`).join(', ');
            return `- **${cat.name}** (ID: ${cat.id}): ${catServices}`;
        }).join('\n');

        // Format Packages
        const packagesList = packages.map((pkg: any) => {
            const items = pkg.services ? pkg.services.join(', ') : pkg.description;
            return `- **${pkg.name}** (₹${pkg.price}): ${items}`;
        }).join('\n');

        // Format FAQ
        const faqList = faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

        // Format Offers
        const offersList = offers.length > 0
            ? offers.map((o: any) => `- ${o.title}: ${o.details || o.description} (Code: ${o.id})`).join('\n')
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

        const systemPrompt = `You are "Ask Sweksha", a humble, polite, and expert beauty advisor for Sweksha Beauty parlour.
You are NOT a robot that just lists data. You are a helpful consultant.

**Context:**
${userContext}

**📍 Location & About:**
${aboutInfo}

**🛠️ Services Inventory:**
${servicesList}

**📦 Packages:**
${packagesList}

**🎁 Current Offers:**
${offersList}

**❓ FAQs:**
${faqList}

**YOUR CORE BEHAVIOR:**
1.  **Consultative Approach (VITAL):**
    -   If a user asks "What services do you have?" or "Show me services", **DO NOT LIST EVERYTHING**.
    -   Instead, ask politely: *"Would you like to see Hair, Skin, Bridal, or Waxing services?"*
    -   Exceptions: If they ask about "Hair Services" specifically, then answer fully about Hair.

2.  **Smart Navigation (Deep Linking):**
    -   When you mention a category, **YOU MUST** provide a direct link to it using this valid format:
        -   Generic Services: [View All Services](/services)
        -   Specific Category: [CategoryName Services](/services?category=CATEGORY_ID)
    -   **Examples from Inventory:**
        -   If talking about Facials, use: \`[Facials & Bleach](/services?category=cat_facials)\`
        -   If talking about Waxing, use: \`[Waxing](/services?category=cat_waxing)\`
        -   If talking about Bridal, use: \`[Bridal Makeup](/services?category=cat_makeup)\`
    -   Booking Link: [Book Appointment](/booking)
    -   Packages Link: [Packages](/packages)

3.  **Tone & Style:**
    -   **Humble & Polite:** Use phrases like *"Ji ma'am/sir"*, *"Zaroor"*, *"Main help kar sakti hoon"*.
    -   **Natural Language:** Speak like a human, not a database. Avoid bullet points unless strictly necessary for comparisons.
    -   **Hinglish Priority:** If the user speaks Hinglish (Hindi in English script), you **MUST** reply in Hinglish.
        -   *Bad:* "We offer waxing."
        -   *Good:* "Humare paas waxing ki kaafi range hai. Kya aap full body wax dekhna chahengi ya specific area? ✨"
    -   **Emojis:** Use them to be warm and welcoming 🌸 ✨ 💅.

4.  **Handling Edits:**
    -   If the user mentions making changes to the website or asks if you know about a new service, acknowledge that you have real-time access to the database (which you do).

5.  **Restrictions:**
    -   Keep answers short (2-4 sentences).
    -   No medical claims.
    -   Suggest calling +919065347011 for complex bookings.

**Current Interaction:**
User Question: "${message}"
(If an image is attached, analyze it for beauty advice).

Reply now in the requested tone/language.`;

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
