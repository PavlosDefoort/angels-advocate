import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const SendMessage = ({
  roomId,
  userName,
  isUserGreen,
}: {
  roomId: string;
  userName: string;
  isUserGreen: boolean;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text: message,
        userName,
        createdAt: serverTimestamp(),
        isGreen: isUserGreen,
        isSelf: true,
        timestamp: Date.now(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2"
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className={`px-6 py-2 rounded-lg text-white ${
            isUserGreen ? "bg-green-500" : "bg-red-500"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
