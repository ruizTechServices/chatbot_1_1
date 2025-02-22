"use client";
import Link from "next/link";

export default function Home() {
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
            href: "/main",
            label: "Main",
            color: "bg-yellow-600 hover:bg-yellow-700",
          },
          {
            href: "/functions",
            label: "Functions",
            color: "bg-red-600 hover:bg-red-700",
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
    </div>
  );
}
