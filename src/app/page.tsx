"use client";
import { useState } from "react";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../lib/firebase";
import { User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

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
  };

  return (
    <div className="flex h-screen">
      {/* left side of page */}
      <div className="flex-1 bg-black text-white flex flex-col items-end justify-center pr-8">
        <div className="text-right ml-8">
          <h1 className="text-8xl font-bold">Angel&apos;s</h1>
          <p className="text-2xl mt-2">Challenge your mind.</p>
        </div>
      </div>
      {/* right side of page */}
      <div className="flex-1 bg-white text-black flex flex-col items-start justify-center pl-8">
        <div className="text-left mr-8">
          <h1 className="text-8xl font-bold">Advocate</h1>
          <p className="text-2xl mt-2">Change your perspective.</p>
        </div>
      </div>
      {/* navigation buttons */}
      <nav className="absolute top-0 right-0 p-4 flex space-x-4">
        <button className="bg-gray-200  dark:bg-black dark:text-slate-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
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
      </nav>
    </div>
  );
}
