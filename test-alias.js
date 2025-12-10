
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

async function testModel() {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the alias from the user's list
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    console.log("Testing gemini-flash-latest...");
    try {
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.log("Error Name:", e.name);
        console.log("Error Message:", e.message);
    }
}

testModel();
