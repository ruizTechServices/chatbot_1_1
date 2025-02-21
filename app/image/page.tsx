'use client';
import React, { useState } from 'react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) return;

    const response = await fetch('/api/openai/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setImageUrl(data.data[0].url);
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl mb-4 text-white">Image Generator</h1>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="p-2 border rounded w-full mb-4" placeholder="Enter prompt..." />
      <button onClick={generateImage} className="px-4 py-2 bg-purple-500 text-white rounded">Generate Image</button>
      {imageUrl && <img src={imageUrl} alt="Generated" className="w-48 h-48mt-4 rounded-lg" />}
    </div>
  );
}