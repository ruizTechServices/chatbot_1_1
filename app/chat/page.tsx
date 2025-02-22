"use client";
import Link from "next/link";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { convertMessagesToJSONL } from "@/utils/functions/messageToJsonl";

export default function Chat() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: { text: string; sender: "user" | "bot" }[] = [
      ...messages,
      { text: input, sender: "user" },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: newMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "No response";
      const completeMessages = [
        ...newMessages,
        { text: botResponse, sender: "bot" as "bot" },
      ];
      setMessages(completeMessages);
      const jsonlData = convertMessagesToJSONL(completeMessages);

      // @PineconeDB: Save the newMessages and botResponse to PineconeDB here
      // Example: await saveToPineconeDB(newMessages, botResponse);

      // @SaveChat: Save the newMessages and botResponse to a JSONL file here
      // Example: await saveToJSONL(newMessages, botResponse);
      // Inside your handleSaveChat function

      fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: jsonlData }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save chat history");
          }
          console.log("Chat history saved successfully");
        })
        .catch((error) => {
          console.error("Error saving chat history:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 text-black">
      <Link className="text-white" href="/">
        Home
      </Link>
      <h1 className="text-2xl mb-4 text-white">Chatbot</h1>
      <select
        onChange={(e) => setModel(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>

      <div className="mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow mr-2 p-2 border rounded text-black"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
