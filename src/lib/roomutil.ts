import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function createRoom(): Promise<string> {
  const roomRef = await addDoc(collection(db, "rooms"), {
    createdAt: new Date(),
  });
  return roomRef.id;
}
