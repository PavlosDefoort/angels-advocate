"use client";
import React, { useState, useRef, useEffect } from "react";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";
import { realtimeDb } from "@/lib/firebase"

interface ChatPageProps {
  topic: string;
  userColour: string;
}

interface Message {
  text: string;
  isSelf: boolean;
  isGreen: boolean;
  timestamp: number;
  isNeutral?: boolean; // Optional attribute for control messages
  isControl?: boolean; // Attribute for control messages
}

const db = getDatabase();

export default function ChatPage({
  topic = "Default Topic: AI Will Take Over Every Tech Job",
}: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isUserGreen, setIsUserGreen] = useState<boolean | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);
  const [bgColor, setBgColor] = useState<string>(""); // Track background color


  useEffect(() => {
    setIsUserGreen(Math.random() < 0.5);
  }, []);

  useEffect(() => {
    if (isUserGreen === null) return;

    // Add the initial message only once
    if (messages.length === 0) {
      const initialMessage: Message = {
        text: `Welcome! You're on the ${isUserGreen ? "green" : "red"} side.`,
        isSelf: false,
        isGreen: isUserGreen,
        isNeutral: true,
      };
      setMessages([initialMessage]);
    }
  }, [isUserGreen, messages.length]);

  useEffect(() => {
    const messagesCount = messages.filter((msg) => !msg.isNeutral).length;
    /* switches sides every 4 messages sent by player */
    if (
      messages.length > 1 &&
      messagesCount % 8 === 0 &&
      messagesCount !== lastSwitchCount
    ) {
      setIsUserGreen((prev) => !prev);
      const switchMessage: Message = {
        text: `Switching sides! You're now on the ${!isUserGreen ? "green" : "red"
          } side.`,
        isSelf: false,
        isGreen: !isUserGreen,
        isNeutral: true,
      };
      setMessages((prev) => [...prev, switchMessage]);

      // Add the control message with buttons for game control
      const controlMessage: Message = {
        text: "Choose your action:",
        isSelf: false,
        isGreen: false,
        isNeutral: true, // Indicating a neutral message for control options
        isControl: true, // Indicating this is a control message
      };
      setMessages((prev) => [...prev, controlMessage]);

      setLastSwitchCount(messagesCount);
    }
  }, [messages, isUserGreen, lastSwitchCount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputText.trim() || !isUserTurn) return;
    if (isUserGreen === null) return;

    const newMessage = {
      text: `(your take) ${inputText.trim()}`,
      isSelf: true,
      isGreen: isUserGreen,
    };

    setBgColor(isUserGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]");
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsUserTurn(false);

    setTimeout(() => {
      const response = {
        text: `Response to: ${inputText}`,
        isSelf: false,
        isGreen: !isUserGreen,
      };
      setMessages((prev) => [...prev, response]);
      setIsUserTurn(true);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleControlAction = (action: string) => {
    // Handle different game control actions (continue, handshake, bomb)
    if (action === "continue") {
      setMessages((prev) => {
        return prev.filter((msg) => !msg.isNeutral); // Remove the neutral message
      });
      setIsUserTurn(true); // Allow the user to continue
    } else {
      // Implement end game logic for handshake or bomb
      setMessages((prev) => [
        ...prev,
        {
          text: `Debate ended by ${action}.`,
          isSelf: false,
          isGreen: false,
          isNeutral: true,
        },
      ]);
    }
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
        <h1 className="flex-grow text-center text-3xl">{topic}</h1>
      </div>

      <div
        className={`flex-1 flex relative overflow-hidden transition-all duration-500 ${isUserGreen === false ? "bg-[#da7b7b]" : "bg-[#7CCD85]"
          }`}
      >
        <div className="relative w-full h-full overflow-y-auto px-4">
          <div className="flex flex-col space-y-4 py-4 mb-24">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isNeutral
                  ? "justify-center" // Neutral messages should be centered
                  : msg.isGreen
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 text-white ${msg.isNeutral
                    ? "bg-gray-400 text-black" // Neutral messages have a gray background
                    : msg.isGreen
                      ? "bg-[#2E7D32]"
                      : "bg-[#8B0000]"
                    }`}
                >
                  {msg.text}
                  {/* Render control buttons if it's a control message */}
                  {msg.isControl && (
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleControlAction("handshake")}
                        className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                      >
                        Handshake
                      </button>
                      <button
                        onClick={() => handleControlAction("bomb")}
                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                      >
                        Bomb
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {messages.some((msg) => msg.isNeutral) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <div className="flex space-x-4">
            <button
              onClick={() => handleControlAction("continue")}
              className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
            <button
              onClick={() => handleControlAction("handshake")}
              className="px-5 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Handshake
            </button>
            <button
              onClick={() => handleControlAction("bomb")}
              className="px-5 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Bomb
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div
          className={`flex items-center ${isUserGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]"
            } p-3 rounded-lg shadow-lg`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 text-white p-3 ${isUserGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]"
              } border-none mr-3 focus:outline-none`}
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
