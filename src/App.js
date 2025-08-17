import React, { useState, useEffect } from "react";
import { useAuthenticationStatus, useSignOut } from "@nhost/react";
import ChatList from "./ChatList";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Messages from "./Messages";

function App() {
  const { isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedChat(null);
    }
  }, [isAuthenticated]);
  
 if (!isAuthenticated) {
    return (
      <div>
        {showSignUp ? <SignUp /> : <SignIn />}
        <button onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? "Already have an account? Sign In" : "New here? Sign Up"}
        </button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={signOut}>Sign Out</button>
      {!selectedChat ? (
        <ChatList onSelectChat={(id) => setSelectedChat(id)} />
      ) : (
        <div>
			<button onClick={() => setSelectedChat(null)}>⬅ Back to Chats</button>
			<Messages chatId={selectedChat} />
		</div>
      )}
    </div>
  );
}

export default App;
