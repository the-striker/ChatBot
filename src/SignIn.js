import React, { useState } from 'react';
import { nhost } from './nhost';

function SignIn({ onSignedIn,initialMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [message, setMessage] = useState(initialMessage || "");
  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error, session } = await nhost.auth.signIn({ email, password });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ Welcome back!`);
      onSignedIn && onSignedIn(session.user);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: "#E5E5E5" }}>Sign In to your AI Assistant</h2>
      <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
          style={{ width: '95%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', background: "#2C2C2C",
            color: "#E5E5E5" }}
        />
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <button type="submit" style={{
          width: '50%',
          padding: '12px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
		  fontWeight: "bold",
          cursor: 'pointer'
        }}>Sign In</button>
		</div>
      </form>
      {message && <p style={{ marginTop: '12px', textAlign: 'center' }}>{message}</p>}
    </>
  );
}

export default SignIn;
