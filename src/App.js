import React, { useState, useEffect } from "react";
import { useAuthenticationStatus, useSignOut } from "@nhost/react";
import ChatList from "./ChatList";
import AuthPage from "./AuthPage";
import ChatPage from "./ChatPage";
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
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "280px", borderRight: "1px solid #ddd", background: "#f9f9f9" }}>
        <button 
          onClick={signOut} 
          style={{ width: "100%", padding: "10px", cursor: "pointer", background: "#f44336", color: "white", border: "none" }}
        >
          Sign Out
        </button>
        {!selectedChat && <ChatList onSelectChat={(id) => setSelectedChat(id)} />}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <div>
            <button onClick={() => setSelectedChat(null)} style={{ margin: "10px" }}>
              ⬅ Back to Chats
            </button>
            <Messages chatId={selectedChat} />
          </div>
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

export default App;