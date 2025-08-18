import React, { useState } from 'react';
import { nhost } from './nhost';

function SignUp({ onSignedUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
	  e.preventDefault();
	  console.log("Sign Up triggered with Enter");
    const { error } = await nhost.auth.signUp({ email, password });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ Sign-Up successful! Check your email for verification.`);
      onSignedUp && onSignedUp();
    }
  };

 return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: '#2196F3',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseOver={e => e.target.style.background = '#1976D2'}
          onMouseOut={e => e.target.style.background = '#2196F3'}
          >
            Sign Up
          </button>
        </form>
        {message && <p style={{ marginTop: '15px', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
}

export default SignUp;
