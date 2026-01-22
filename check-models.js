// check-models.js
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("❌ No API Key found in .env");
    process.exit(1);
}

// We use the direct REST API to list models
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log(`Checking models for key ending in: ...${key.slice(-4)}`);

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        if (!data.models) {
            console.log("⚠️ No models found. This usually means the API is not enabled in Google Cloud Console.");
            return;
        }

        console.log("\n✅ AVAILABLE MODELS:");
        console.log("--------------------------------");
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        chatModels.forEach(m => {
            // Only show models that support chat (generateContent)
            console.log(`Name: ${m.name.replace("models/", "")}`);
        });
        console.log("--------------------------------");

    } catch (err) {
        console.error("Connection Error:", err.message);
    }
}

listModels();