import React, { useState } from 'react';
import { nhost } from './nhost';

function SignUp({ onSignedUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
  e.preventDefault();
  const { session, error } = await nhost.auth.signUp({ email, password });

  if (error) {
    setMessage(`❌ Error: ${error.message}`);
    return;
  }

  if (!session) {
    // verification required
    setMessage("✅ Verification link sent! Please check your email.");
    // Delay before switching to SignIn
    setTimeout(() => {
      onSignedUp && onSignedUp("Verification link sent! Please check your email.");
    }, 2000); // 2s delay
  } else {
    // If email verification is disabled, user is logged in immediately
    setMessage("🎉 Account created and signed in!");
    onSignedUp && onSignedUp();
  }
};


  return (
    <>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up to Create an Account</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '95%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc',background: "#2C2C2C",
            color: "#E5E5E5" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '95%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc',background: "#2C2C2C",
            color: "#E5E5E5"  }}
        />
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <button type="submit" style={{
          width: '50%',
          padding: '12px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
		  fontWeight: "bold",
          cursor: 'pointer'
        }}>Sign Up</button>
		</div>
      </form>
      {message && <p style={{ marginTop: '12px', textAlign: 'center',color: "#AAAAAA" }}>{message}</p>}
    </>
  );
}

export default SignUp;
