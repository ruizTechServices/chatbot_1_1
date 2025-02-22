// File: /Users/gios_laptop/CascadeProjects/chatbot_1_1/app/api/save-chat/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = body;
    
    // Append the incoming data to the JSONL file
    const filePath = path.join(process.cwd(), 'chat-history.jsonl');
    fs.appendFileSync(filePath, data + "\n", "utf8");
    
    return NextResponse.json({ message: "Chat history appended successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to append chat history." }, { status: 500 });
  }
}