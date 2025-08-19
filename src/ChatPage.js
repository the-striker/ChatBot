// ChatPage.js
import React, { useState } from "react";
import ChatList from "./ChatList";
import Messages from "./Messages";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);

 return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif", background: "#121212", color: "#E5E5E5" }}>
      <ChatList onSelectChat={setSelectedChatId} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChatId ? (
          <Messages chatId={selectedChatId} />
        ) : (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "#888", fontSize: "18px" }}>
            👈 Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}