'use client';

import React, { useState, useRef } from 'react';
import { ReactMic } from 'react-mic';

export default function VoiceChat() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Start recording
  const startRecording = () => {
    setRecording(true);
  };

  // This fires automatically when recording goes from true -> false
  const onStopRecording = async ({ blob }: { blob: Blob }) => {
    setRecording(false);

    // 1) Build FormData
    const formData = new FormData();
    formData.append('audioFile', blob, 'recording.wav');

    // 2) Call /api/openai/transcriptions
    const transcribeResponse = await fetch('/api/openai/transcriptions', {
      method: 'POST',
      body: formData, // <-- send FormData
    });

    const transcribedData = await transcribeResponse.json();
    const transcribedText = transcribedData.text || 'Failed to transcribe';
    setTranscript(transcribedText);

    // 3) Chat with GPT-4o
    const chatResponse = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: transcribedText }],
      }),
    });

    const chatData = await chatResponse.json();
    const botResponse = chatData.choices?.[0]?.message?.content || 'No response';
    setResponseText(botResponse);

    // 4) Convert chat response to speech (TTS)
    const ttsResponse = await fetch('/api/elevenlabs/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: botResponse }),
    });

    if (!ttsResponse.ok) {
      console.error('Failed to generate speech', await ttsResponse.text());
    } else {
      const audioBlob = await ttsResponse.blob();
      const speechUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(speechUrl);

      // 5) Play the generated speech
      if (audioRef.current) {
        audioRef.current.src = speechUrl;
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white">Voice-Only Chatbot</h1>

      <ReactMic
        record={recording}
        className="hidden"
        onStop={onStopRecording}   // <-- onStop triggers the function above
        mimeType="audio/wav"
      />

      <button
        onMouseDown={startRecording}
        onMouseUp={() => setRecording(false)}
        className={`px-6 py-3 mt-6 rounded-lg text-white ${recording ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        {recording ? 'Recording... Release to Stop' : 'Hold to Speak'}
      </button>

      {transcript && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">You said:</h2>
          <p className="p-2 bg-gray-200 rounded">{transcript}</p>
        </div>
      )}

      {responseText && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Bot Response:</h2>
          <p className="p-2 bg-blue-200 rounded">{responseText}</p>
        </div>
      )}

      {audioUrl && <audio ref={audioRef} controls className="mt-4" />}
    </div>
  );
}