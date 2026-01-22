# 🤖 Real-time AI Chatbot

A real-time, bidirectional AI chatbot built with **Next.js**, **Socket.io**, and **Google Gemini AI**. It features a modern glass-morphism UI, dark mode, message persistence, and Markdown support.

## 🚀 Features Implemented

- [x] **Real-time Communication**: Bi-directional Websockets using Socket.io.
- [x] **AI Integration**: Powered by Google Gemini Pro / Flash models.
- [x] **Modern UI/UX**: Glass-inspired design, responsive layout, and typing indicators.
- [x] **Dark/Light Theme**: Persistent theme toggling.
- [x] **Markdown Support**: Renders code blocks and formatted text nicely.
- [x] **Local Persistence**: Chat history and theme preferences saved in LocalStorage.
- [x] **Chat Management**: Clear chat history and copy-to-clipboard functionality.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), CSS Modules
- **Backend**: Node.js (Custom Server), Express, Socket.io
- **AI**: Google Generative AI SDK (@google/generative-ai)
- **Language**: TypeScript

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-link-here>
   cd ai-chatbot

2. **Install Dependencies**
npm install

3. **Set up Environmental Variables**
Create a .env file in the root directory.

Copy the contents of .env.example into .env.

Add your Google Gemini API Key.

 .env file should look like this:

GEMINI_API_KEY=AIzaSy...<your_actual_key>
PORT=3000

4. **Run the Project**
npm run dev 

5. **Access the App**
Open your browser and navigate to: http://localhost:3000

**Time Spent on Assignment**
Total Time: Approx. 5 hours

Backend Setup & Socket Integration: 1.5 hours

AI Integration (Gemini SDK): 1 hour

Frontend UI/UX (Glassmorphism & Responsiveness): 2 hours

Documentation & Polish: 0.5 hours

**Demo Video**
Check out the video demonstration of the project features here:

https://drive.google.com/file/d/1TDFkWzpsyhQSEBGzIsXOIdK6v6_hEyi4/view?usp=sharing

