"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Define the interface for the room data
interface RoomData {
  name: string;
  topic: string;
}

const Room = ({ roomId }: { roomId: string }) => {
  const [roomData, setRoomData] = useState<RoomData | null>(null); // Type the state properly

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "rooms", roomId),
      (docSnapshot) => {
        console.log(docSnapshot);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          // Add a null/undefined check for data properties before accessing them
          if (
            data &&
            typeof data.name === "string" &&
            typeof data.topic === "string"
          ) {
            setRoomData(data as RoomData); // Typecast the data to RoomData
          } else {
            console.error("Invalid room data format", data);
          }
        } else {
          console.log("Room does not exist");
        }
      },
      (error) => {
        console.error("Error getting room data:", error);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  if (!roomData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Room: {roomData.name}</h1>
      <p>Topic: {roomData.topic}</p>
    </div>
  );
};

export default Room;
