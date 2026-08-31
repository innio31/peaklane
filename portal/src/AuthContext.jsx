import { createContext, useContext, useEffect, useState } from 'react';
import { restoreSession, login as apiLogin, logout as apiLogout } from './api/auth';
import { setUnauthorizedHandler } from './api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still checking, null = logged out

  useEffect(() => {
    // If ANY API call comes back 401 (token genuinely revoked/expired), drop
    // straight to login — this is the only trigger, never a client-side timer.
    setUnauthorizedHandler(() => setSession(null));

    restoreSession().then(setSession);
  }, []);

  async function login(userType, username, password) {
    const data = await apiLogin(userType, username, password);
    setSession(data);
    return data;
  }

  async function logout() {
    await apiLogout();
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, checking: session === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
