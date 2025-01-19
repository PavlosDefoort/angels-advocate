"use client";

import { useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SendMessage = ({
  roomId,
  userName,
}: {
  roomId: string;
  userName: string;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      // Add the message to Firestore
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text: message,
        userName: userName,
        createdAt: serverTimestamp(), // Store the time the message was sent
      });
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="border p-2 rounded"
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default SendMessage;
