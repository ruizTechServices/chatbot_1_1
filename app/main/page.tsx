// File: /Users/gios_laptop/CascadeProjects/chatbot_1_1/app/main/page.tsx
"use client";
import Link from "next/link";
import React, { useState } from "react";
import DOMPurify from "dompurify";

// Use DOMPurify to sanitize input by disallowing any HTML tags.
const sanitize = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export default function Chatbot() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState(""); // Dynamic file name

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDownloadChatHistory = () => {
    // Pass the fileName to the download endpoint (if available)
    const url = fileName
      ? `/api/download-chat?fileName=${encodeURIComponent(fileName)}`
      : "/api/download-chat";
    window.open(url, "_blank");
  };

  const handleSendMessage = async () => {
    // Sanitize input and check it's not empty.
    const sanitizedInput = sanitize(input);
    if (!sanitizedInput.trim()) return;

    // Determine the file name for the conversation.
    // Use a local variable to avoid state update delays.
    let currentFileName = fileName;
    if (messages.length === 0 && !fileName) {
      const words = sanitizedInput.split(/\s+/);
      const fileNameBase = words.slice(0, 5).join(" ");
      // Remove any problematic characters for file names.
      const safeBase = fileNameBase.replace(/[^a-z0-9\-_\s]/gi, "").trim();
      currentFileName = `${safeBase}-chat.jsonl`;
      setFileName(currentFileName);
    }

    // Update in-memory chat state with the user's message.
    const newMessages = [
      ...messages,
      { text: sanitizedInput, sender: "user" as "user" }
    ];
    setMessages(newMessages);
    setInput("");

    try {
      // Send conversation context to the OpenAI chat endpoint.
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const botText =
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content
          ? data.choices[0].message.content
          : "No response.";

      // Append the bot's response to in-memory state.
      setMessages((prev) => [...prev, { text: botText, sender: "bot" as "bot" }]);

      // Create a JSONL turn representing this conversation turn.
      const chatTurn = JSON.stringify({
        userMessage: sanitizedInput,
        botResponse: botText,
      });

      // Append this turn to the JSONL file via the save-chat endpoint.
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: chatTurn, fileName: currentFileName }),
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to fetch response.", sender: "bot" as "bot" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-4">
        <Link href="/">Home Page</Link>
        <button
          onClick={handleDownloadChatHistory}
          className="p-2 bg-green-500 text-white rounded"
        >
          Download Chat History
        </button>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg max-w-xs ${
              message.sender === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type a message..."
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}