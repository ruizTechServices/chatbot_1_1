'use client';
import React, { useState, useMemo } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBv7_DvehZ5xgPTDpABfc9pWEKocFN-3Lg';
  const genAI = useMemo(() => new GoogleGenerativeAI(apiKey), [apiKey]);
  const model = useMemo(() => genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" }), [genAI]);

  // Helper to convert a file to a base64 string
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // The result is in the format "data:application/pdf;base64,ABC..."
        // We split to get just the base64 string.
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handler for PDF file input
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim() && !pdfFile) return;

    // Append the user's text message to the chat log
    const userMessage: Message = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    // Build conversation context from all messages
    const conversationContext = [...messages, userMessage]
      .map(msg => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
      .join("\n");

    setLoading(true);

    // Append an empty bot message that will be updated as the stream arrives
    setMessages(prev => [...prev, { role: 'bot', text: "" }]);

    try {
      let promptInput;
      if (pdfFile) {
        // Convert the PDF file to base64
        const pdfBase64 = await getBase64(pdfFile);
        const pdfPart = {
          inlineData: {
            data: pdfBase64,
            mimeType: "application/pdf"
          }
        };
        // Combine the PDF content with the conversation context.
        // The first part is the PDF, and the second part is your text prompt.
        promptInput = [pdfPart, conversationContext];
      } else {
        promptInput = conversationContext;
      }

      // Start streaming the response from the Gemini API
      const streamResult = await model.generateContentStream(promptInput);

      // For each text chunk received, update the last bot message
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        setMessages(prev => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          updatedMessages[lastIndex].text += chunkText;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Append an error message to the chat log
      setMessages(prev => [...prev, { role: 'bot', text: "Error: Unable to fetch response." }]);
    } finally {
      setInputText("");
      setLoading(false);
      // Optionally clear the PDF file if you don't want to reuse it
      setPdfFile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Google Chatbot with PDF Context</h1>
      
      {/* Chat Log */}
      <div className="border border-gray-300 rounded p-4 mb-4 h-[500px] overflow-y-auto">
        {loading && <div className="text-gray-500">Loading<span className="animate-pulse">...</span></div>}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${msg.role === 'user' ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      
      {/* PDF File Input */}
      <div className="mb-4">
        <label htmlFor="pdf-upload" className="block mb-1">Upload a PDF (optional):</label>
        <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePdfChange} />
        {pdfFile && <div className="text-sm mt-1">Selected file: {pdfFile.name}</div>}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;