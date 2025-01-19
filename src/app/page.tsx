"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // To redirect the user
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../lib/firebase";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { doc, getDoc, setDoc } from "firebase/firestore";
import BackgroundCircles from "@/components/BackgroundCircles";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [roomCode, setRoomCode] = useState<string>(""); // For the room code input
  const router = useRouter(); // To programmatically navigate
  const [name, setName] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [isTrue, setIsTrue] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      setUser(user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // Refresh the page to clear the user state
    router.refresh();
  };

  const handleJoinRoom = () => {
    console.log(roomCode);
    if (roomCode) {
      // Redirect to the room page with the room code
      router.push(`/room/${roomCode}`);
    }
  };

  const handleCreateRoom = async () => {
    try {
      // Generate a unique room ID
      const roomCode = Math.random().toString(36).substring(2, 10);

      // Create the room object to store in Firestore
      const roomData = {
        name: name.trim() || "Untitled Room", // Use entered name or default value
        topic: topic.trim() || "General", // Use entered topic or default value
        createdBy: user?.uid, // Current user's UID
        createdAt: new Date().toISOString(), // Timestamp
      };

      // Add the room to Firestore
      await setDoc(doc(db, "rooms", roomCode), roomData);

      // Redirect to the room page
      router.push(`/room/${roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    try {
      const roomCode = otp; // The full OTP entered by the user
      const roomDoc = await getDoc(doc(db, "rooms", roomCode));

      if (roomDoc.exists()) {
        // If the room exists, navigate to the room page
        setIsSearching(false);
        setRoomCode(roomCode);
        setIsTrue(true);
        // router.push(`/room/${roomCode}`);
      } else {
        // If the room doesn't exist, notify the user
        // alert("Room does not exist. Please check the code and try again.");
        setIsWrong(true);
        setIsTrue(false);
      }
    } catch (error) {
      console.error("Error verifying room code:", error);
    }
  };
  return (
    <div className="relative h-screen">
      <BackgroundCircles />
      <div className="flex h-screen">
        {/* Left side of page */}
        <div className="flex-1 bg-black text-white flex flex-col items-end justify-center pr-8">
          <div className="text-right ml-8">
            <h1 className="text-8xl font-bold">Angel&apos;s</h1>
            <p className="text-2xl mt-2">Challenge your mind.</p>
          </div>
        </div>

        {/* Middle section with input */}
        {user && (
          <div
            className="flex-1 flex items-center justify-center bg-gray-100"
            style={{ zIndex: 30 }}
          >
            <div className="w-1/2 flex flex-col items-center space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white font-semibold hover:shadow-lg hover:shadow-black-500/50 transition duration-300 ease-in-out"
                  >
                    Create new Debate Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Room</DialogTitle>
                    <DialogDescription>
                      Create a new room to start a debate. Choose a name and
                      topic.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="name"
                        className="text-right font-semibold"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        className="col-span-3 shadow-sm"
                        placeholder="Who's debating?"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="topic"
                        className="text-right font-semibold"
                      >
                        Topic
                      </Label>
                      <Input
                        id="topic"
                        value={topic}
                        placeholder="Max 140 characters"
                        className="col-span-3 shadow-sm"
                        onChange={(e) => {
                          if (e.target.value.length <= 140)
                            setTopic(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={() => handleCreateRoom()}>
                      Create!
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <p className="font-bold text-1xl">OR</p>
              <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                <Label htmlFor="room-code" className="font-semibold">
                  Enter room code
                </Label>
                <InputOTP
                  maxLength={8}
                  onComplete={(e) => handleOTPComplete(e)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {isWrong && (
                <p className="text-red-500 text-sm">Room does not exist.</p>
              )}
              {isTrue && <p className="text-green-500 text-sm">Room exists!</p>}

              <Button
                variant="default"
                className="w-full mt-4"
                disabled={isSearching}
                onClick={() => handleJoinRoom()}
              >
                Join Room
              </Button>
            </div>
          </div>
        )}

        {/* Right side of page */}
        <div className="flex-1 bg-white text-black flex flex-col items-start justify-center pl-8">
          <div className="text-left mr-8">
            <h1 className="text-8xl font-bold">Advocate</h1>
            <p className="text-2xl mt-2">Change your perspective.</p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 p-4">
        <img
          src="logo.png"
          alt="Logo"
          className="h-20"
        />
      </div>

      {/* Navigation buttons */}
      <nav className="absolute top-0 right-0 p-4 flex space-x-4">
        {!user && (
          <button
            className="bg-gray-200 dark:bg-black dark:text-slate-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none hover:shadow-lg hover:shadow-black-500/50 transition duration-300 ease-in-out z-50 shadow-md"
            onClick={handleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              className="w-6 h-6"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>

            <span className="ml-4 flex items-start flex-col leading-none">
              <span className="text-xs text-gray-600 mb-1 dark:text-slate-100">
                SIGN IN WITH
              </span>
              <span className="title-font font-medium">Google</span>
            </span>
          </button>
        )}
        {user && (
          <div className="flex items-center space-x-4 pr-2">
            <div className="flex flex-col">
              <p className="text-xs">Currently signed in as </p>
              <p>{user.displayName}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <Avatar className="cursor-pointer hover:opacity-50">
                  <AvatarImage src={user.photoURL!} />
                  <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                </Avatar>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to logout. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleLogout()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </nav>
    </div>
  );
}
