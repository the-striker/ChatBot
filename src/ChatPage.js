// ChatPage.js
import React, { useState } from "react";
import ChatList from "./ChatList";
import Messages from "./Messages";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Sidebar - Chat list */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #ddd",
          background: "#f9f9f9",
        }}
      >
        <ChatList onSelectChat={setSelectedChatId} />
      </div>

      {/* Right Side - Messages */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChatId ? (
          <Messages chatId={selectedChatId} />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "gray",
              fontSize: "18px",
            }}
          >
            👈 Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
