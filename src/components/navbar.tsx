"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import SignUpButton from "./signup-button";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";
import Link from "next/link";

const NavBar: React.FC = () => {
  const { user, isLoading } = useUser();

  return (
    <div className="py-4 flex flex-row w-full justify-between bg-blue-500">
      <div className="w-20 flex gap-8">
        <Link href="/">Home</Link>
        {/* <a href="/profile">Server Protected Profile</a> */}
      </div>
      <div className="flex gap-4">
        {!user && !isLoading && (
          <>
            <SignUpButton />
            <LoginButton />
          </>
        )}
        {user && !isLoading && (
          <>
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
};
export default NavBar;
