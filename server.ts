import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import next from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Check for API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL ERROR: GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  
  // CORS setup for Socket.io
  const io = new Server(server, {
    cors: { origin: "*" } 
  });

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    socket.on("sendMessage", async (message) => {
      try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        socket.emit("receiveMessage", text);
      } catch (error: any) {
        console.error("❌ AI Error:", error.message);
        // Send the ACTUAL technical error to the chat window
        socket.emit("receiveMessage", `⚠️ ERROR: ${error.message}`);
      }
    });
  });

  // --- THE FIX ---
  // We replaced '*' with a Regex /(.*)/
  // This satisfies strict Express parsers.
  app.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err?: any) => {
    if (err) throw err;
    console.log("----------------------------------------");
    console.log("      🤖 CHATBOT SERVER V2.0 STARTED    ");
    console.log(`      🚀 Ready on http://localhost:${PORT}`);
    console.log("----------------------------------------");
  });
});