"use client";
import React, { useState, useRef, useEffect } from "react";
interface ChatPageProps {
  topic: string;
}

interface Message {
  text: string;
  isSelf: boolean;
  isGreen: boolean;
}

export default function ChatPage({
  topic = "Default Topic: AI Will Take Over Every Tech Job",
}: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isUserGreen, setIsUserGreen] = useState<boolean | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);

  useEffect(() => {
    setIsUserGreen(Math.random() < 0.5);
  }, []);

  useEffect(() => {
    if (isUserGreen === null) return;

    const initialMessage: Message = {
      text: `Welcome! You're on the ${isUserGreen ? "green" : "red"} side.`,
      isSelf: false,
      isGreen: isUserGreen,
    };
    setMessages([initialMessage]);
  }, [isUserGreen]);

  useEffect(() => {
    const selfMessagesCount = messages.filter((msg) => msg.isSelf).length;
    /* switches sides every 4 messages sent by player */
    if (
      messages.length > 1 &&
      selfMessagesCount % 4 === 0 &&
      selfMessagesCount !== lastSwitchCount
    ) {
      setIsUserGreen((prev) => !prev);
      const switchMessage: Message = {
        text: `Switching sides! You're now on the ${
          !isUserGreen ? "green" : "red"
        } side.`,
        isSelf: false,
        isGreen: !isUserGreen,
      };
      setMessages((prev) => [...prev, switchMessage]);
      setLastSwitchCount(selfMessagesCount);
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

      <div className="flex-1 flex relative overflow-hidden">
        <div className="absolute w-1/2 h-full left-0 bg-[#FAA2A2]"></div>
        <div className="absolute w-1/2 h-full right-0 bg-[#7CCD85]"></div>
        <div className="relative w-full h-full overflow-y-auto px-4">
          <div className="flex flex-col space-y-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isGreen ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 text-white ${
                    msg.isGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]"
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
        <div
          className={`flex items-center ${
            isUserGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]"
          } p-3 rounded-lg shadow-lg`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 text-white p-3 ${
              isUserGreen ? "bg-[#2E7D32]" : "bg-[#8B0000]"
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
