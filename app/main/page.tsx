'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' as 'user' }];
    setMessages(newMessages);
    setInput('');

    

    // Mock bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'This is a mock response from ChatGPT!', sender: 'bot' as 'bot' },
      ]);
    }, 1000);
  };


  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100 text-black">
      <Link href="/">Home Page</Link>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg max-w-xs ${
              message.sender === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-300'
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