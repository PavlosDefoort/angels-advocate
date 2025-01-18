"use client";
import React, { useEffect } from "react";

export default function SpecificPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("body-chat");

    return () => {
      document.body.classList.remove("body-chat");
    };
  }, []);

  return <main>{children}</main>;
}
