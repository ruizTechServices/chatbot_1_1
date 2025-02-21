'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import VoiceRecorder to avoid SSR issues
const VoiceRecorder = dynamic(() => import('../../components/voice_recorder'), { ssr: false });

export default function VoiceChat() {
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle recording stop and process the recorded audio
  const onStopRecording = async (blob: Blob) => {
    try {
      // Build FormData
      const formData = new FormData();
      formData.append('audioFile', blob, 'recording.wav');

      // Transcribe speech to text
      const transcribeResponse = await fetch('/api/openai/transcriptions', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) throw new Error('Transcription failed');
      const transcribedData = await transcribeResponse.json();
      const transcribedText = transcribedData.text || 'Failed to transcribe';
      setTranscript(transcribedText);

      // Chat with GPT-4o using transcribed text
      const chatResponse = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: transcribedText }],
        }),
      });

      if (!chatResponse.ok) throw new Error('Chat request failed');
      const chatData = await chatResponse.json();
      const botResponse = chatData.choices?.[0]?.message?.content || 'No response';
      setResponseText(botResponse);

      // Convert chat response to speech (TTS)
      const ttsResponse = await fetch('/api/openai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: botResponse, model: 'tts-1', voice: 'alloy' }),
      });

      if (!ttsResponse.ok) throw new Error('TTS generation failed');
      const ttsData = await ttsResponse.json();
      const speechUrl = ttsData.url;
      setAudioUrl(speechUrl);

      // Play generated speech
      if (audioRef.current) {
        audioRef.current.src = speechUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white">Voice-Only Chatbot</h1>

      {/* Voice Recorder Component */}
      <VoiceRecorder onStop={onStopRecording} />

      {/* Transcription Display */}
      {transcript && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">You said:</h2>
          <p className="p-2 bg-gray-200 rounded">{transcript}</p>
        </div>
      )}

      {/* Chatbot Response Display */}
      {responseText && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Bot Response:</h2>
          <p className="p-2 bg-blue-200 rounded">{responseText}</p>
        </div>
      )}

      {/* Generated Speech Audio */}
      {audioUrl && <audio ref={audioRef} controls className="mt-4" />}
    </div>
  );
}