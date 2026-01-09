const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.log("❌ Error: GEMINI_API_KEY is missing from .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function testModels() {
    console.log("🔍 Testing available models with your API Key...");

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n👉 Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`✅ SUCCESS! Model '${modelName}' is working.`);
            console.log(`   Response: ${response.text()}`);
            return; // Stop after finding one that works
        } catch (error) {
            // Check for 404 specifically
            if (error.message.includes("404") || error.message.includes("not found")) {
                console.log(`❌ '${modelName}' not found or not supported.`);
            } else {
                console.log(`❌ Error with '${modelName}': ${error.message}`);
            }
        }
    }

    console.log("\n⚠️  All attempted models failed. Please check your API Key and Google AI Studio project settings.");
}

testModels();
