import React, { useState } from 'react';
import { nhost } from './nhost';

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

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Sign Up
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default SignUp;
