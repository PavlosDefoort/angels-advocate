import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
} from "firebase/firestore";

interface Message {
  userName: string;
  text: string;
  createdAt: Date | null; // Firestore serverTimestamp will be converted to Date
}

const RoomMessages = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    // Subscribe to the messages collection for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          userName: data.userName,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convert to Date if available
        };
      });
      setMessages(newMessages); // Update the messages state when data changes
    });

    // Unsubscribe from the listener when the component is unmounted
    return () => unsubscribe();
  }, [roomId]);

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <p>
            <strong>{message.userName}</strong>: {message.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RoomMessages;
