"use client";

import React from "react";

const NavBar: React.FC = () => {
  return (
    <div className="py-4 flex flex-row w-full justify-between bg-blue-500">
      {/* <div className="w-20 flex gap-8">
        <Link href="/">Home</Link>
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
      </div> */}
    </div>
  );
};
export default NavBar;
