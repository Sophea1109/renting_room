"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user } = useUser();
  const router = useRouter();

  // While redirecting or loading user, render nothing (or a loading spinner)
  if (!user) {
    return null; 
  }

  return children; // Render main app if user exists
}
