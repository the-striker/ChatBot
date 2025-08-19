import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function AuthPage({ onSignedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0B0C10',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
	  color: "#E5E5E5"
    }}>
      <div style={{
        background: '#1F1F1F',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '50px'
      }}>
        {isSignUp ? (
          <SignUp onSignedUp={() => setIsSignUp(false)} />
        ) : (
          <SignIn onSignedIn={onSignedIn} />
        )}

        {/* Toggle inside the box */}
        <div style={{ textAlign: "center", marginTop: "15px", fontSize: '14px',color: "#AAAAAA" }}>
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                style={{ color: "#4CAF50", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                style={{ color: "#4CAF50", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
