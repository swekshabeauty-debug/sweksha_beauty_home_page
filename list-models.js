
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
let apiKey = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

async function listModels() {
    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const models = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name);

            fs.writeFileSync('models.json', JSON.stringify(models, null, 2));
            console.log("Models written to models.json");
        } else {
            console.log("Error listing models:", JSON.stringify(data));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

listModels();
