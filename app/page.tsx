"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { preformat } from "@/utils/functions/preformatting";
import { readAllRows } from "@/utils/supabase/functions/read_all_rows";
import { insertRow } from "@/utils/supabase/functions/insert_a_row";
import { generateUuid } from "@/utils/functions/generateUuid";

export default function Home() {
  // States for Preformat Demo
  const [preformatInput, setPreformatInput] = useState("");
  const [preformattedString, setPreformattedString] = useState("");

  // States for new row insertion
  const [conversationId, setConversationId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isUser, setIsUser] = useState(true);

  // State for displaying rows from the database
  const [rows, setRows] = useState<any[] | null>(null);

  // State for web search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  // Preformat Function Test
  const handlePreformat = () => {
    setPreformattedString(preformat(preformatInput));
  };

  // Read all rows from the database
  const handleReadAllRows = async () => {
    const { data, error } = await readAllRows();
    if (error) {
      console.error("Error fetching rows:", error);
    } else {
      setRows(data);
    }
  };

  // Insert new row into the messages table
  const handleInsertRow = async () => {
    try {
      // Validate required fields
      if (!conversationId || !positionId || !textInput) {
        console.error("Please provide Conversation ID, Position ID, and Text.");
        return;
      }

      // Convert positionId to number
      const positionNumber = parseInt(positionId, 10);
      if (isNaN(positionNumber)) {
        console.error("Position ID must be a valid number.");
        return;
      }

      // Fetch embedding from your API endpoint
      const response = await fetch("/api/openai/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: textInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch embeddings");
      }
      const { data: embedding } = await response.json(); // Expecting an array of floats

      // Prepare the new row data according to your table schema
      const newRow = {
        conversation_id: conversationId,
        position_id: positionNumber,
        text: textInput,
        is_user: isUser,
        embedding, // Embedding array returned from the API
        // created_at will default to now() in the database
      };

      // Insert the new row via Supabase
      const { data, error } = await insertRow(newRow);
      console.log("Insert response:", { data, error });
      if (error) {
        console.error("Error inserting row:", error);
      } else {
        console.log("Row inserted successfully:", data);

        // Clear the form inputs on success
        setConversationId("");
        setPositionId("");
        setTextInput("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Set initial conversationId using generateUuid
  useEffect(() => {
    setConversationId(generateUuid());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        OpenAI API Playground
      </h1>
      <p className="text-xl mb-8">Choose a feature to explore:</p>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
        {[
          {
            href: "/chat",
            label: "Chatbot",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            href: "/embeddings",
            label: "Embeddings",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            href: "/image",
            label: "Image Generator",
            color: "bg-purple-600 hover:bg-purple-700",
          },
          {
            href: "/voice-chat",
            label: "Voice Chat",
            color: "bg-red-600 hover:bg-red-700",
          },
          {
            href: "/main",
            label: "Main",
            color: "bg-yellow-600 hover:bg-yellow-700",
          },
        ].map((item, index) => (
          <Link key={index} href={item.href} className="w-full">
            <button
              className={`w-full py-4 ${item.color} rounded-lg transition-colors duration-300 text-lg font-semibold shadow-lg`}
            >
              {item.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Preformat Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Preformat Function Test
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={preformatInput}
            onChange={(e) => setPreformatInput(e.target.value)}
            placeholder="Enter text for preformat"
            className="p-2 rounded-lg text-black w-full sm:w-2/3"
          />
          <button
            onClick={handlePreformat}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-1/3"
          >
            Preformat
          </button>
        </div>
        <p className="mt-4 p-2 bg-gray-700 rounded-lg break-words">
          <span className="font-semibold">Output:</span> {preformattedString}
        </p>
      </div>

      {/* Database Rows & Insert New Row */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Database Rows</h2>
        <button
          onClick={handleReadAllRows}
          className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          Read All Rows
        </button>

        <div className="bg-gray-700 p-4 rounded-lg mt-4 w-full max-w-2xl overflow-auto">
          {rows ? (
            rows.map((row, index) => (
              <div key={index} className="border-b border-gray-500 py-2">
                <p>
                  <strong>ID:</strong> {row.id}
                </p>
                <p>
                  <strong>Conversation ID:</strong> {row.conversation_id}
                </p>
                <p>
                  <strong>Position ID:</strong> {row.position_id}
                </p>
                <p>
                  <strong>Text:</strong> {row.text}
                </p>
                <p>
                  <strong>Is User:</strong> {row.is_user.toString()}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(row.created_at).toLocaleString()}
                </p>
                <details className="text-gray-400 text-sm">
                  <summary>View Embedding (Hidden by Default)</summary>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(row.embedding, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
