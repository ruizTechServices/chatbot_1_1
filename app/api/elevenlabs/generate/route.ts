import client from '@/utils/elevenlabs/client';
import { NextResponse } from 'next/server';
import player from 'play-sound';
import fs from 'fs';
import path from 'path';

const play = player();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const audio = await client.generate({
      voice: "Sarah",
      text: text || "Listen, you haven't sent any text for me to generate, but if I am saying this, that means I work!",
      model_id: "eleven_multilingual_v2",
    });

    const tempFilePath = path.join('/tmp', 'audio.mp3');
    const writeStream = fs.createWriteStream(tempFilePath);

    audio.pipe(writeStream);

    writeStream.on('finish', () => {
      play.play(tempFilePath, (err: any) => {
        if (err) {
          console.error("Error playing audio:", err);
          throw err;
        }
      });
    });

    return NextResponse.json({ message: "Audio generated and played successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}

//This endpoint is complete. 
//Using Postman:
// Set Request Type: Change the request type to POST.
// Set Request URL: Use the same URL as before, but without query parameters.
// Add JSON Body: In the "Body" tab, select "raw" and set the content type to "JSON". Then, enter the JSON data:
// 
// ```
//json
// 
// {
//   "text": "Hello World"
// } 
//```