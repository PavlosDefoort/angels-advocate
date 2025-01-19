import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Message {
  text: string;
  userName: string;
  isGreen: boolean;
  timestamp: number;
  isNeutral?: boolean;
  isControl?: boolean;
}

interface RoomMessagesProps {
  roomId: string;
  userName: string;
  isUserGreen: boolean;
  setIsUserGreen: Dispatch<SetStateAction<boolean>>;
}

const MessageBubble = ({
  message,
  isUserMessage,
}: {
  message: Message;
  isUserMessage: boolean;
}) => {
  const bubbleStyle = message.isNeutral
    ? "bg-gray-200 mx-auto max-w-[80%] text-center"
    : `${message.isGreen ? "bg-green-500" : "bg-red-500"} text-white ${
        isUserMessage ? "ml-auto" : "mr-auto"
      }`;

  return (
    <div className={`rounded-lg p-3 my-2 max-w-[80%] ${bubbleStyle}`}>
      {message.text}
    </div>
  );
};

const RoomMessages = ({
  roomId,
  userName,
  isUserGreen,
  setIsUserGreen,
}: RoomMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);

  useEffect(() => {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data.text,
          userName: data.userName,
          isGreen: data.isGreen,
          timestamp: data.createdAt?.toMillis() || Date.now(),
          isNeutral: data.isNeutral,
          isControl: data.isControl,
        };
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const messagesCount = messages.filter((msg) => !msg.isNeutral).length;
    if (
      messages.length > 1 &&
      messagesCount % 4 === 0 &&
      messagesCount !== lastSwitchCount
    ) {
      setIsUserGreen((prev) => !prev);
      const switchMessage: Message = {
        text: `Switching sides! You're now on the ${
          !isUserGreen ? "proponent (green)" : "opponent (red)"
        } side.`,
        userName: "system",
        isGreen: true,
        isNeutral: true,
        timestamp: Date.now(),
      };
      setHasSwitched(true);
      setMessages((prev) => [...prev, switchMessage]);

      if (hasSwitched) {
        const controlMessage: Message = {
          text: "Choose your action:",
          userName: "system",
          isGreen: true,
          timestamp: Date.now(),
          isNeutral: true,
          isControl: true,
        };
        setMessages((prev) => [...prev, controlMessage]);
      }

      setLastSwitchCount(messagesCount);
    }
  }, [
    messages.length,
    isUserGreen,
    lastSwitchCount,
    hasSwitched,
    setIsUserGreen,
  ]);

  return (
    <div
      className={`flex flex-col space-y-2 p-4 h-[600px] overflow-y-auto ${
        isUserGreen ? "bg-green-300" : "bg-red-300"
      }`}
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isUserMessage={message.userName === userName}
        />
      ))}
    </div>
  );
};

export default RoomMessages;
