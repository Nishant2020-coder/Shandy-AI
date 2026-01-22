const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ PASTE YOUR REAL API KEY HERE BETWEEN THE QUOTES
const API_KEY = "AIzaSyAZlHJ_rBFE7kmg8HS9br4wVp1TM1TfWWY"; 

async function testConnection() {
  console.log("1. Starting connection test...");
  
  if (!API_KEY || API_KEY.includes("PASTE_YOUR")) {
    console.error("❌ ERROR: You didn't paste the API key in the file!");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("2. Sending request to Gemini...");
    const result = await model.generateContent("Say hello!");
    const response = await result.response;
    const text = response.text();
    
    console.log("\n✅ SUCCESS! Google Gemini responded:");
    console.log("-----------------------------------");
    console.log(text);
    console.log("-----------------------------------");
  } catch (error) {
    console.error("\n❌ FAILED. Here is the real error:");
    console.error(error.message);
  }
}

testConnection();