"use client";
import React from "react";
interface ChatPageProps {
  topic: string;
}

export default function ChatPage({ topic }: ChatPageProps) {
  const handleSend = () => {
    alert("Message sent!"); // Example functionality for the Send button
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Navbar */}
      <div className="flex items-center justify-between h-20 px-5 bg-gray-300 text-black shadow-md">
        <button
          className="bg-none text-white text-lg cursor-pointer"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
        <h1 className="flex-grow text-center text-2xl">{topic}</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-grow">
        <div className="flex-1 bg-[#FAA2A2]"></div>
        <div className="flex-1 bg-[#7CCD85]"></div>
      </div>

      {/* Floating Input Box */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="flex items-center bg-green-700 p-3 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 text-white p-3 bg-green-700 border-none mr-3 focus:outline-none"
          />
          <button
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
