import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface RoomData {
  name: string;
  topic: string;
}

const Room = ({ roomId }: { roomId: string }) => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "rooms", roomId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data?.name && data?.topic) {
            setRoomData(data as RoomData);
          }
        }
      },
      (error) => console.error("Error getting room data:", error)
    );

    return () => unsubscribe();
  }, [roomId]);

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="p-4 border-b">
      <h1 className="text-2xl font-bold">{roomData.name}</h1>
      <p className="text-gray-600">{roomData.topic}</p>
    </div>
  );
};

export default Room;
