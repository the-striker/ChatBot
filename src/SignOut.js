import React from 'react';
import { nhost } from './nhost';

function SignOut({ onSignedOut }) {
  const handleSignOut = async () => {
    await nhost.auth.signOut();
    onSignedOut && onSignedOut();
  };

  return (
    <button onClick={handleSignOut} style={{ padding: '10px 20px', marginTop: '20px' }}>
      Sign Out
    </button>
  );
}

export default SignOut;
