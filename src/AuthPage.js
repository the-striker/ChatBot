import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function AuthPage({ onSignedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
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
