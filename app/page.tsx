"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";

let socket: Socket;

type Message = {
  sender: "user" | "ai";
  text: string;
  id: string; // Unique ID for copying specific messages
};

export default function Home() {
  // State
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Socket & Load Data
  useEffect(() => {
    // Load Theme & Chat from LocalStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);

    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) setChat(JSON.parse(savedChat));

    // Connect Socket
    socket = io();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("receiveMessage", (text: string) => {
      const newMessage: Message = { sender: "ai", text, id: Date.now().toString() };
      setChat((prev) => {
        const updated = [...prev, newMessage];
        localStorage.setItem("chatHistory", JSON.stringify(updated)); // Auto-save
        return updated;
      });
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  // 3. Actions
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = { sender: "user", text: message, id: Date.now().toString() };
    const updatedChat = [...chat, newMessage];
    
    setChat(updatedChat);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChat)); // Auto-save
    
    setIsLoading(true);
    socket.emit("sendMessage", message);
    setMessage("");
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setChat([]);
      localStorage.removeItem("chatHistory");
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Simple feedback
  };

  // Dynamic Styles based on Theme
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div style={theme.container}>
      <div style={theme.card}>
        
        {/* HEADER */}
        <div style={theme.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={theme.avatar}>🤖</div>
            <div>
              <h1 style={theme.title}>Shandy AI</h1>
              <div style={theme.status}>
                <span style={{
                  ...theme.statusDot, 
                  backgroundColor: isConnected ? "#10B981" : "#EF4444"
                }} />
                {isConnected ? "Online" : "Connecting..."}
              </div>
            </div>
          </div>
          
          {/* Header Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={toggleTheme} style={theme.iconButton} title="Toggle Theme">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={clearChat} style={theme.iconButton} title="Clear Chat">
              🗑️
            </button>
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={theme.chatArea}>
          {chat.length === 0 && (
            <div style={theme.emptyState}>
              <p>👋 Hello! I'm your AI assistant.</p>
              <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>Ask me anything to get started.</p>
            </div>
          )}
          
          {chat.map((msg) => (
            <div key={msg.id} style={{
              ...theme.messageRow,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}>
              {msg.sender === "ai" && <div style={theme.messageAvatar}>🤖</div>}
              
              <div style={msg.sender === "user" ? theme.userBubble : theme.aiBubble}>
                {msg.sender === "ai" ? (
                  <div className="markdown-content">
                    {/* Render Markdown for AI */}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    
                    {/* Copy Button for AI Messages */}
                    <button 
                      onClick={() => copyToClipboard(msg.text)}
                      style={theme.copyButton}
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div style={{ ...theme.messageRow, justifyContent: "flex-start" }}>
              <div style={theme.messageAvatar}>🤖</div>
              <div style={theme.aiBubble}>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div style={theme.inputArea}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={theme.input}
            disabled={!isConnected}
          />
          <button 
            onClick={sendMessage} 
            style={theme.sendButton}
            disabled={!message.trim() || !isConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// --- THEME STYLES ---

const commonStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    transition: "background 0.3s ease",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    height: "85vh",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: "background 0.3s ease",
  },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" },
  messageRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  copyButton: {
    display: "block",
    marginTop: "8px",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    padding: "2px 6px",
    opacity: 0.6,
  }
};

const lightTheme: any = {
  ...commonStyles,
  container: { ...commonStyles.container, background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" },
  card: { ...commonStyles.card, backgroundColor: "#ffffff" },
  header: { padding: "20px", borderBottom: "1px solid #f0f0f0", backgroundColor: "rgba(255,255,255,0.95)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" },
  status: { color: "#64748b", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" },
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#ffffff" },
  inputArea: { padding: "20px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "10px", backgroundColor: "white" },
  input: { flex: 1, padding: "14px 20px", borderRadius: "50px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", color: "#000" },
  sendButton: { padding: "0 24px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "50px", fontWeight: "600", cursor: "pointer" },
  userBubble: { backgroundColor: "#2563eb", color: "white", padding: "12px 18px", borderRadius: "20px 20px 4px 20px", maxWidth: "80%", fontSize: "0.95rem", lineHeight: "1.5" },
  aiBubble: { backgroundColor: "#f1f5f9", color: "#1e293b", padding: "12px 18px", borderRadius: "20px 20px 20px 4px", maxWidth: "80%", fontSize: "0.95rem", lineHeight: "1.5" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  messageAvatar: { width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginBottom: "4px" },
  iconButton: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "5px" },
  emptyState: { textAlign: "center", color: "#94a3b8", marginTop: "40px" },
};

const darkTheme: any = {
  ...commonStyles,
  container: { ...commonStyles.container, background: "#111827" },
  card: { ...commonStyles.card, backgroundColor: "#1f2937", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
  header: { padding: "20px", borderBottom: "1px solid #374151", backgroundColor: "#1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#f3f4f6" },
  status: { color: "#9ca3af", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" },
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#1f2937" },
  inputArea: { padding: "20px", borderTop: "1px solid #374151", display: "flex", gap: "10px", backgroundColor: "#1f2937" },
  input: { flex: 1, padding: "14px 20px", borderRadius: "50px", border: "1px solid #374151", background: "#374151", fontSize: "1rem", outline: "none", color: "#f3f4f6" },
  sendButton: { padding: "0 24px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "50px", fontWeight: "600", cursor: "pointer" },
  userBubble: { backgroundColor: "#3b82f6", color: "white", padding: "12px 18px", borderRadius: "20px 20px 4px 20px", maxWidth: "80%", fontSize: "0.95rem", lineHeight: "1.5" },
  aiBubble: { backgroundColor: "#374151", color: "#f3f4f6", padding: "12px 18px", borderRadius: "20px 20px 20px 4px", maxWidth: "80%", fontSize: "0.95rem", lineHeight: "1.5" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  messageAvatar: { width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginBottom: "4px" },
  iconButton: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "5px" },
  emptyState: { textAlign: "center", color: "#6b7280", marginTop: "40px" },
};