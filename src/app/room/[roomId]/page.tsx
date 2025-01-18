"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const RoomPage = () => {
  const router = useRouter();
  const { roomId } = useParams();
  interface Room {
    // Define the structure of your room data here
    name: string;
    // Add other fields as needed
  }

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      const roomDoc = await getDoc(doc(db, "rooms", roomId as string));
      if (!roomDoc.exists()) {
        alert("Room not found");
        router.push("/");
      } else {
        setRoom(roomDoc.data() as Room);
      }
    }

    if (roomId) fetchRoom();
  }, [roomId, router]);

  return room ? <div>Room: {roomId}</div> : <div>Loading...</div>;
};

export default RoomPage;
