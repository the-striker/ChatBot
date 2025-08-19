import React, { useState, useEffect } from "react";
import { useAuthenticationStatus, useSignOut } from "@nhost/react";
import ChatList from "./ChatList";
import AuthPage from "./AuthPage";
import Messages from "./Messages";

function App() {
  const { isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedChat(null);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage onSignedIn={() => {}} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif",background: "#121212", color: "#E5E5E5",overflow: "hidden" }}>
      {/* Sidebar: Sign Out + ChatList */}
      <div style={{ display: "flex", flexDirection: "column", width: "280px", borderRight: "1px solid #333", background: "#1E1E1E", flexShrink: 0}}>
    <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
    <button
      onClick={signOut}
      style={{
        width: "90%",
        margin: "10px auto",
        padding: "10px",
        cursor: "pointer",
        background: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "6px",
		flexShrink: 0
      }}
    >
      Sign Out
    </button>
  </div>

  {/* Main Chat Area */}
  <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#121212", overflow: "hidden" }}>
    {selectedChat ? (
      <Messages chatId={selectedChat} />
    ) : (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "18px"  }}>
        👈 Select a chat to start messaging
      </div>
    )}
  </div>
</div>
  );
}

export default App;
