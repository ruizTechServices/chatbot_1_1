"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateParagraph } from "@/utils/functions/generateParagraph";
import { generateEmbeddings } from "@/utils/functions/generateEmbeddings";
import Link from "next/link";
import { readAllRows } from "@/utils/supabase/functions/read_all_rows";
import { preformat } from "@/utils/functions/preformatting";
import { convertMessagesToJSONL } from '@/utils/functions/messageToJsonl';

export default function Functions() {
  const [preformatInput, setPreformatInput] = useState("");
  const [preformattedString, setPreformattedString] = useState("");
  const [uuid, setUuid] = useState("");
  const [paragraphContext, setParagraphContext] = useState(""); // Separate state for paragraph
  const [embeddingContext, setEmbeddingContext] = useState(""); // Separate state for embeddings
  const [length, setLength] = useState(100); // Default length
  const [generatedParagraph, setGeneratedParagraph] = useState("");
  const [generatedEmbeddings, setGeneratedEmbeddings] = useState("");
  const [messages, setMessages] = useState([]); // State for messages

  // State for displaying rows from the database
  const [rows, setRows] = useState<any[] | null>(null);

  // Read all rows from the database
  const handleReadAllRows = async () => {
    const { data, error } = await readAllRows();
    if (error) {
      console.error("Error fetching rows:", error);
    } else {
      setRows(data);
    }
  };

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  const handlePreformat = () => {
    setPreformattedString(preformat(preformatInput));
  };

  const handleGenerateUUID = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setUuid(uuidv4());
  };

  const handleGenerateParagraph = async () => {
    const paragraph = await generateParagraph(paragraphContext, length);
    setGeneratedParagraph(paragraph);
  };

  const handleGenerateEmbeddings = async () => {
    const embeddings = await generateEmbeddings(embeddingContext);
    setGeneratedEmbeddings(JSON.stringify(embeddings, null, 2));
  };

  function handleSaveChat(event: React.MouseEvent<HTMLButtonElement>): void {
    const jsonlData = convertMessagesToJSONL(messages);

    console.log("Converted JSONL Data:", jsonlData);

    fetch('/api/save-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: jsonlData }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save chat history');
        }
        console.log('Chat history saved successfully');
      })
      .catch(error => {
        console.error('Error saving chat history:', error);
      });
  }

  return (
    <div>
      <Link href="/">Home Page</Link>
      <div className="text-center m-5">
        <h1 className="text-2xl font-bold mb-4 text-center">Functions Page</h1>
        <p className="text-center">
          This page demonstrates various functions that I created.
        </p>
      </div>
      {/* Preformat Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
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
        <p className="mt-4 p-2 bg-gray-700 rounded-lg break-words mb-5">
          <span className="font-semibold">Output:</span> {preformattedString}
        </p>
      </div>

      {/* Generate UUID Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Generate UUID Function Test
        </h2>
        <button
          onClick={handleGenerateUUID}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-1/3"
        >
          Generate UUID
        </button>
        <p className="mt-4 p-2 bg-gray-700 rounded-lg break-words mb-5">
          <span className="font-semibold">Output:</span> {uuid}
        </p>
      </div>

      {/* Generate Paragraph Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Generate Paragraph
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={paragraphContext}
            onChange={(e) => setParagraphContext(e.target.value)}
            placeholder="Enter context"
            className="p-2 rounded-lg text-black w-full"
          />
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            placeholder="Length"
            className="p-2 rounded-lg text-black w-full"
          />
          <button
            onClick={handleGenerateParagraph}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Generate Paragraph
          </button>
        </div>
        <p className="mt-4 p-2 bg-gray-700 rounded-lg break-words mb-5">
          <span className="font-semibold">Output:</span> {generatedParagraph}
        </p>
      </div>

      {/* Generate Embeddings Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Generate Embeddings
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={embeddingContext}
            onChange={(e) => setEmbeddingContext(e.target.value)}
            placeholder="Enter context"
            className="p-2 rounded-lg text-black w-full"
          />
          <button
            onClick={handleGenerateEmbeddings}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Generate Embeddings
          </button>
        </div>
        <p className="mt-4 p-2 bg-gray-700 rounded-lg break-words mb-5">
          <span className="font-semibold">Output:</span> {generatedEmbeddings}
        </p>
      </div>

      {/* Read All Rows Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
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
            <p className="text-gray-400 mb-5">No data available.</p>
          )}
        </div>
      </div>

      {/* Save Chat Function Test */}
      <div className="mt-8 w-full max-w-md mx-auto border-b-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Save Chat</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleSaveChat}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Save Chat
          </button>
        </div>
      </div>
    </div>
  );
}
