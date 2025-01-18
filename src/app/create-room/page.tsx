"use client";
import { useState } from "react";
import { createRoom } from "../../lib/roomutil";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    const id = await createRoom();
    setRoomId(id);
    console.log("Room created, ID:", id);
  };

  return (
    <div>
      <button onClick={handleCreateRoom}>Create Room</button>
      {roomId && <p>Room ID: {roomId}</p>}
    </div>
  );
};

export default CreateRoom;
