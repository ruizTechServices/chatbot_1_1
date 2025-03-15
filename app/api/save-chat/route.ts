// File: /app/api/save-chat/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Sanitize file name to remove any characters that may cause issues.
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9\-_.]/gi, '-');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, fileName } = body; // fileName is provided by the client

    // Use the provided fileName or default to "history.jsonl"
    const safeFileName = fileName ? sanitizeFileName(fileName) : "history.jsonl";
    const filePath = path.join(process.cwd(), safeFileName);

    // Append the conversation turn as a JSON object (followed by a newline)
    fs.appendFileSync(filePath, data + "\n", "utf8");

    return NextResponse.json({ message: "Chat history appended successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to append chat history." },
      { status: 500 }
    );
  }
}