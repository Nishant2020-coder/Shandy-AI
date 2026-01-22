Markdown# 🤖 Real-Time AI Chatbot

A full-stack, bi-directional AI chatbot built with **Next.js**, **Socket.io**, and **Google Gemini AI**. This application features a modern, responsive Glassmorphism UI, real-time streaming responses, and persistent chat history.

## 🚀 Features Implemented

The following features have been successfully implemented:

- [x] **Real-time Communication**: Instant bi-directional messaging using Socket.io (WebSockets).
- [x] **AI Integration**: Powered by Google's Gemini Pro / 1.5-Flash models.
- [x] **Markdown Support**: AI responses render code blocks, lists, and bold text using `react-markdown`.
- [x] **Persistent Chat**: Chat history and theme preferences are saved in LocalStorage.
- [x] **Modern UI/UX**: Custom Glassmorphism design with responsive bubbles and auto-scrolling.
- [x] **Theme System**: Toggle between Dark Mode and Light Mode.
- [x] **Chat Management**: Functionality to clear conversation history.
- [x] **Utility Features**: One-click "Copy to Clipboard" for AI responses.
- [x] **Typing Indicators**: Visual feedback while the AI is generating a response.

## 🛠️ Tech Stack and Libraries

- **Frontend**: 
  - Next.js (App Router)
  - React
  - CSS Modules (Custom styling)
  - `react-markdown` (Text formatting)
  - `socket.io-client` (WebSocket connection)

- **Backend**: 
  - Node.js (Custom Server)
  - Express.js
  - Socket.io (WebSocket server)
  - `@google/generative-ai` (Gemini SDK)
  - `dotenv` (Environment management)

## 📋 Prerequisites

Before running this project, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn

## ⚙️ Setup Instructions (Step-by-Step)

Follow these steps to set up and run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ai-chatbot.git](https://github.com/your-username/ai-chatbot.git)
cd ai-chatbot
2. Install DependenciesInstall all required Node modules:Bashnpm install
3. Configure Environment VariablesCreate a .env file in the root directory.Copy the contents of .env.example into .env.Add your Google Gemini API Key.Your .env file should look like this:Code snippetGEMINI_API_KEY=AIzaSy...<your_actual_key>
PORT=3000
4. Run the ApplicationStart the development server (runs both the Express backend and Next.js frontend):Bashnpm run dev
5. Access the AppOpen your browser and navigate to:http://localhost:3000🔑 Environment Variables NeededVariableDescriptionRequired?GEMINI_API_KEYYour Google Generative AI API Key.YesPORTPort for the server to listen on (default: 3000).No⏱️ Time Spent on AssignmentTotal Time: Approx. 5 hoursBackend Setup & Socket Integration: 1.5 hoursAI Integration (Gemini SDK): 1 hourFrontend UI/UX (Glassmorphism & Responsiveness): 2 hoursDocumentation & Polish: 0.5 hours🎥 Demo VideoCheck out the video demonstration of the project features here:[INSERT VIDEO LINK HERE]