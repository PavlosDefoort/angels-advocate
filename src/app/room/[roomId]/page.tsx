"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Room from "./Room";
import RoomMessages from "./RoomMessages";
import SendMessage from "./SendMessage";
import { useAuth } from "@/contexts/AuthContext";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [isUserGreen, setIsUserGreen] = useState(true);

  if (!roomId) return <div>Room not found</div>;

  return (
    <div className="flex flex-col h-screen">
      <Room roomId={roomId} />
      <div className="flex-1 overflow-hidden">
        <RoomMessages
          roomId={roomId}
          userName={user?.displayName || "Anonymous"}
          isUserGreen={isUserGreen}
          setIsUserGreen={setIsUserGreen}
        />
      </div>
      <SendMessage
        roomId={roomId}
        userName={user?.displayName || "Anonymous"}
        isUserGreen={isUserGreen}
      />
    </div>
  );
};

export default RoomPage;
