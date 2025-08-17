import React, { useEffect, useState } from 'react';
import { nhost } from './nhost';

function AuthTest() {
  const [user, setUser] = useState(null);

  // Check user status on load
  useEffect(() => {
    const currentUser = nhost.auth.getUser();
    setUser(currentUser);

    // Optional: listen to auth changes
    const unsubscribe = nhost.auth.onAuthStateChanged((event, session) => {
      setUser(session?.user || null);
      console.log('Auth Event:', event, session);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auth Test</h2>
      {user ? (
        <div>
          ✅ Logged in as: {user.email}
          <br />
          User ID: {user.id}
          <br />
          <button onClick={() => nhost.auth.signOut()}>Sign Out</button>
        </div>
      ) : (
        <p>❌ Not logged in</p>
      )}
    </div>
  );
}

export default AuthTest;
