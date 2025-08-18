import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function AuthPage({ onSignedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        padding: "20px"
      }}
    >
      {isSignUp ? (
        <SignUp onSignedUp={() => setIsSignUp(false)} />
      ) : (
        <SignIn onSignedIn={onSignedIn} />
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {isSignUp ? (
          <p>
            Already have an account?{" "}
            <button
              style={{ color: "#2196F3", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <button
              style={{ color: "#2196F3", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
