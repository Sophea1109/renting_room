// src/components/ChatLayout.js (or wherever your Header lives)
"use client";
import { useState } from "react";
import Header from "./Header";
import ChatManager from "./ChatManager";

export default function ChatLayout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* The Header is passed the function to toggle the state */}
      <Header onMessagesClick={() => setIsChatOpen(true)} />
      
      <main>{children}</main>

      {/* The Manager is controlled by the state passed to the Header */}
      {isChatOpen && (
        <ChatManager onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
}