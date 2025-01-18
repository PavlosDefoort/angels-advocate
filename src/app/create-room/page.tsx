"use client";
import { useState } from "react";
import { createRoom } from "../../lib/roomutil";

const ShareRoom = () => {
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleShareRoom = async () => {
    const id = await createRoom();
    setRoomId(id);
    const link = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(link);
    alert(`Room link copied: ${link}`);
  };

  return (
    <div>
      <button onClick={handleShareRoom}>Create and Share Room</button>
      {roomId && <p>Room ID: {roomId}</p>}
    </div>
  );
};

export default ShareRoom;
