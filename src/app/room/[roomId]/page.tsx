"use client";
import React, { useEffect, useRef, useState } from "react";

const preWrittenMessages = [
  {
    text: "Emily: AI lacks human creativity, intuition, and the ability to make decisions in unpredictable situations, which are vital in tech.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134401000,
  },
  {
    text: "Emily: AI still requires human oversight, and it can be biased, lacking the nuance and accountability humans provide.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134403000,
  },
  {
    text: "Emily: AI may automate content creation, but human creativity will always be needed for UX/UI design, innovation, and strategic decisions.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134405000,
  },
  {
    text: "Emily: Some tasks require more than efficiency, and complex problem-solving and relationship-building cannot be replaced by AI.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134407000,
  },
  {
    text: "Emily: AI's learning capabilities are improving rapidly, and it will soon have no limits on the jobs it can take over.",
    isSelf: false,
    isGreen: true,
    timestamp: 1674134408000,
  },
  {
    text: "Emily: AI eliminates human error, making it more reliable, especially in critical roles like cybersecurity.",
    isSelf: false,
    isGreen: true,
    timestamp: 1674134410000,
  },
  {
    text: "Emily: AI can automate tasks like generating templates and designs in web and app development without needing developer intervention.",
    isSelf: false,
    isGreen: true,
    timestamp: 1674134412000,
  },
  {
    text: "Emily: AI will reduce the need for specialized workers by autonomously managing tasks like network and database administration.",
    isSelf: false,
    isGreen: true,
    timestamp: 1674134414000,
  },
  {
    text: "Emily: Efficiency isn't always effectiveness, and tech jobs require long-term thinking, empathy, and leadership that AI cannot provide.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134417000,
  },
  {
    text: "Emily: AI can handle parts of the development pipeline, but the collaborative, creative, and team-driven aspects of software development are irreplaceable.",
    isSelf: false,
    isGreen: false,
    timestamp: 1674134419000,
  },
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
  const [isUserGreen, setIsUserGreen] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);

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
    const messagesCount = messages.filter((msg) => !msg.isNeutral).length;
    if (
      messages.length > 1 &&
      messagesCount % 8 === 0 &&
      messagesCount !== lastSwitchCount
    ) {
      setIsUserGreen((prev) => !prev);
      const switchMessage: Message = {
        text: `Switching sides! You're now on the ${
          !isUserGreen ? "proponent (green)" : "opponent (red)"
        } side.`,
        isSelf: false,
        isGreen: !isUserGreen,
        isNeutral: true,
        timestamp: Date.now(),
      };
      setHasSwitched(true);
      setMessages((prev) => [...prev, switchMessage]);

      if (hasSwitched) {
        const controlMessage: Message = {
          text: "Choose your action:",
          isSelf: false,
          isGreen: false,
          timestamp: Date.now(),
          isNeutral: true,
          isControl: true,
        };
        setMessages((prev) => [...prev, controlMessage]);
      }

      setLastSwitchCount(messagesCount);
    }
  }, [messages, isUserGreen, lastSwitchCount, hasSwitched]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputText.trim() || !isUserTurn) return;

    const newMessage: Message = {
      text: `Christian: ${inputText.trim()}`,
      isSelf: true,
      isGreen: isUserGreen,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsUserTurn(false);

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
    if (action === "continue") {
      setMessages((prev) => {
        return prev.filter((msg) => !msg.isNeutral);
      });
      setIsUserTurn(true);
    } else {
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
        <h1 className="flex-grow text-center text-3xl">
          Topic: AI Will Take Over Every Tech Job
        </h1>
      </div>

      <div
        className={`flex-1 flex relative overflow-hidden transition-all duration-500 ${
          isUserGreen ? "bg-[#7CCD85]" : "bg-[#da7b7b]"
        }`}
      >
        <div className="relative w-full h-full overflow-y-auto px-36">
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
                  className={`max-w-[30%] rounded-lg px-4 py-2 text-white ${
                    msg.isNeutral
                      ? "bg-gray-400 text-black"
                      : msg.isGreen
                      ? "bg-[#2E7D32]"
                      : "bg-[#8B0000]"
                  }`}
                >
                  {msg.text}
                  {msg.isControl && (
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleControlAction("handshake")}
                        className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                      >
                        Handshake 🤝
                      </button>
                      <button
                        onClick={() => handleControlAction("bomb")}
                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                      >
                        Bomb 💣
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
