// src/api/auth.js
//
// Three operations: login (gets a token), restoreSession (silent check on
// launch — this is what makes the app open straight to the dashboard instead
// of a login screen every time), and logout (explicit, user-initiated only).

import { API_BASE } from '../config';
import { saveSession, getSession, clearSession } from '../db/tokenStore';
import { api } from './client';

export async function login(userType, username, password) {
  const res = await fetch(`${API_BASE}/auth/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_type: userType, username, password }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'login_failed');
  }

  await saveSession(data);
  return data;
}

/**
 * Call once on app boot. Returns the restored session if the stored token is
 * still valid (and slides its expiry forward server-side), or null if there's
 * no stored session / it's been revoked — in which case show the login screen.
 * Never shows a login screen just because time has passed.
 */
export async function restoreSession() {
  const stored = await getSession();
  if (!stored?.token) return null;

  try {
    const fresh = await api.get('/auth/verify.php');
    // Merge in case the server returned updated user/school info
    const updated = { ...stored, user: fresh.user, role: fresh.role };
    await saveSession(updated);
    return updated;
  } catch {
    await clearSession();
    return null;
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout.php');
  } finally {
    await clearSession();
  }
}
