import React, { useState } from 'react';
import { nhost } from './nhost';
import { useNavigate } from 'react-router-dom';

function SignIn({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async () => {
    const { error, session } = await nhost.auth.signIn({ email, password });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ Welcome back!`);
      onSignedIn && onSignedIn(session.user);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
          Sign In
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default SignIn;
