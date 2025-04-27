import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCNb7QTHBLbfrRjQgVw80NVq0o4GR93kh0" });

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const memoriaContext = "Project Overview: This project develops a MERN Stack Social Media Platform with core features like real-time chat, post creation/deletion, comments, likes, bookmarks, and a unique image-based search functionality. The platform allows users to find profiles using old photos, leveraging deep aging and face recognition. A chatbot is integrated for user support and content recommendations. You are an AI chatbot for the Memoria app, providing intelligent responses based on its features.";

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: `${memoriaContext}\nUser Query: ${input}` }] }],
      });

      let botResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";
      
      // Formatting response for better readability
      botResponse = botResponse.replace(/\*/g, "").replace(/\n/g, "<br />");
      
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot", timestamp: new Date() }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, an error occurred while processing your request.", sender: "bot", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="userinfo flex justify-center items-center flex-col">
      <div className="w-24 h-24 mt-8 rounded-full overflow-hidden ">
            <img src={"data:image/png;base64,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"} alt="Profile" className="w-full h-full object-cover" />

          </div>
        <h2 className="text-xl font-semibold mt-2"> Chatbot</h2>
        
      </div>
      <div className="messages h-[60%] overflow-y-scroll flex flex-col p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xs p-4 rounded-lg shadow-md ${msg.sender === "bot" ? "bg-gray-100 text-gray-900" : "bg-blue-500 text-white"}`}>
              <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }}></p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-blue-200 max-w-xs shadow-md animate-pulse">Typing...</div>
          </div>
        )}
      </div>
      <div className="flex p-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </>
  );
};

export default ChatBot;
