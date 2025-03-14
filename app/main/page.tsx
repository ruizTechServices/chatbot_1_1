"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [
      ...messages,
      { text: input, sender: "user" as "user" },
    ];
    setMessages(newMessages);
    setInput("");

    try {
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
      const botText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content
        : "No response.";
      setMessages((prev) => [
        ...prev,
        { text: botText, sender: "bot" as "bot" },
      ]);
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
      <Link href="/">Home Page</Link>
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
