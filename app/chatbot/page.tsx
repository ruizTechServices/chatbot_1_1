'use client';
import React, { useState } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      
      // Mock bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "I'm a simple mock chatbot. How can I help you?", isUser: false }]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 text-black">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-2 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
