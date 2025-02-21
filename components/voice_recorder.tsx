'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

interface ReactMicProps {
  record: boolean;
  className: string;
  onStop: (blob: Blob) => void;
  mimeType: string;
}

const ReactMic = dynamic<ReactMicProps>(() => import('react-mic'), { ssr: false });

export default function VoiceRecorder({ onStop }: { onStop: (blob: Blob) => void }) {
  const [recording, setRecording] = useState(false);

  return (
    <>
      <ReactMic
        record={recording}
        className="hidden"
        onStop={onStop}
        mimeType="audio/wav"
      />

      <button
        onMouseDown={() => setRecording(true)}
        onMouseUp={() => setRecording(false)}
        className={`px-6 py-3 mt-6 rounded-lg text-white ${recording ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        {recording ? 'Recording... Release to Stop' : 'Hold to Speak'}
      </button>
    </>
  );
}