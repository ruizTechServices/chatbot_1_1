// File: /app/api/download-chat/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9\-_.]/gi, '-');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileNameParam = searchParams.get("fileName") || "history.jsonl";
    const safeFileName = sanitizeFileName(fileNameParam);
    const filePath = path.join(process.cwd(), safeFileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Chat history file not found." },
        { status: 404 }
      );
    }

    // Read file content
    const fileData = fs.readFileSync(filePath, "utf8");

    // Return file data with headers to trigger a download
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to download chat history." },
      { status: 500 }
    );
  }
}