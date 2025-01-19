"use client";

import { useParams } from "next/navigation";
import Room from "./Room";
import RoomMessages from "./RoomMessages";
import SendMessage from "./SendMessage";
import { useAuth } from "@/contexts/AuthContext";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>(); // Get roomId from URL dynamically
  const { user } = useAuth();

  if (!roomId) return <div>Room not found</div>;
  return (
    <div>
      <h1>Debate Room: {roomId}</h1>
      <Room roomId={roomId} />
      <RoomMessages roomId={roomId} />
      <SendMessage
        roomId={roomId}
        userName={user?.displayName || "Anonymous"}
      />
    </div>
  );
};

export default RoomPage;
