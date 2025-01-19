"use client";
import React, { useEffect, useRef, useState } from "react";

const preWrittenMessages = [
  {
    text: "AI is automating complex tasks across various tech roles, and it will eventually dominate every tech-related job.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134400000,
  },
  // ... rest of the messages array
];

interface Message {
  text: string;
  isSelf: boolean;
  isGreen: boolean;
  timestamp: number;
  isNeutral?: boolean;
  isControl?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);
  const isUserGreen = true; // Always initialize as true

  useEffect(() => {
    const initialMessage: Message = {
      text: "Welcome! You're on the proponent (green) side.",
      isSelf: false,
      isGreen: true,
      isNeutral: true,
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputText.trim() || !isUserTurn) return;

    const newMessage: Message = {
      text: `(your take) ${inputText.trim()}`,
      isSelf: true,
      isGreen: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsUserTurn(false);

    // Display pre-written response with delay
    setTimeout(() => {
      if (currentMessageIndex < preWrittenMessages.length) {
        const response = preWrittenMessages[currentMessageIndex];
        setMessages((prev) => [...prev, response]);
        setCurrentMessageIndex((prev) => prev + 1);
        setIsUserTurn(true);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleControlAction = (action: string) => {
    setMessages((prev) => [
      ...prev,
      {
        text: `Debate ended by ${action}.`,
        isSelf: false,
        isGreen: false,
        isNeutral: true,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-none flex items-center justify-between h-20 px-5 bg-gray-300 text-black shadow-md z-10">
        <button
          className="bg-none text-black text-lg cursor-pointer"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
        <h1 className="flex-grow text-center text-3xl">
          Topic: AI Will Take Over Every Tech Job
        </h1>
      </div>

      <div className="flex-1 flex relative overflow-hidden transition-all duration-500 bg-[#7CCD85]">
        <div className="relative w-full h-full overflow-y-auto px-4">
          <div className="flex flex-col space-y-4 py-4 mb-24">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isNeutral
                    ? "justify-center"
                    : msg.isGreen
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 text-white ${
                    msg.isNeutral
                      ? "bg-gray-400 text-black"
                      : msg.isGreen
                      ? "bg-[#2E7D32]"
                      : "bg-[#8B0000]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="flex items-center bg-[#2E7D32] p-3 rounded-lg shadow-lg">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 text-white p-3 bg-[#2E7D32] border-none mr-3 focus:outline-none"
            disabled={!isUserTurn}
          />
          <button
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            onClick={handleSend}
            disabled={!isUserTurn}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
