import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv'; // Not needed since we hardcoded the key

// Manually load env since we are running with node directly
// Hardcoding the key for the test script based on user input to be sure
const API_KEY = 'AIzaSyDQNqOswZvwzuOoKf3YB4XDHkPZmpaKGp8';

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    console.log('Testing Gemini API with key: ' + API_KEY.slice(0, 5) + '...');

    try {
        // Try gemini-1.5-flash first
        console.log('Attempting to connect to gemini-1.5-flash...');
        const model15 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result15 = await model15.generateContent('Hello, are you working?');
        console.log('Success with gemini-1.5-flash!');
        console.log('Response:', result15.response.text());
    } catch (error) {
        console.error('Failed with gemini-1.5-flash:', error.message);
    }

    try {
        // Try gemini-2.0-flash
        console.log('\nAttempting to connect to gemini-2.0-flash...');
        const model20 = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result20 = await model20.generateContent('Hello, are you working?');
        console.log('Success with gemini-2.0-flash!');
        console.log('Response:', result20.response.text());
    } catch (error) {
        console.error('Failed with gemini-2.0-flash:', error.message);
    }
}

run();
