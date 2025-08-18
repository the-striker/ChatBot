import React, { useState } from 'react';
import { nhost } from './nhost';
import { useNavigate } from 'react-router-dom';

function SignUp({ onSignedUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    const { error } = await nhost.auth.signUp({ email, password });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ Sign-Up successful! Check your email for verification.`);
      onSignedUp && onSignedUp();
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
		  onKeyDown={handleKeyPress}
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
		  onKeyDown={handleKeyPress}
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <button onClick={handleSignIn} style={{ padding: '10px 20px' }}>
          Sign Up
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default SignUp;
