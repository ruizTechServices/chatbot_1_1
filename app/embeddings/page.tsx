"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Embeddings() {
  const [input, setInput] = useState("");
  const [embedding, setEmbedding] = useState("");

  const generateEmbedding = async () => {
    if (!input.trim()) return;

    const response = await fetch("/api/openai/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    setEmbedding(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-8 text-black">
      <Link className="text-white" href="/">Home Page</Link>
      <h1 className="text-2xl mb-4 text-white">Text Embeddings</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 border rounded w-full mb-4"
        placeholder="Enter text..."
      />
      <button
        onClick={generateEmbedding}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Generate Embeddings
      </button>
      <pre className="mt-4 p-4 bg-gray-200">{embedding}</pre>
    </div>
  );
}
