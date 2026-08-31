// src/api/client.js
//
// Every API call in the app goes through here. It attaches the stored bearer
// token automatically and handles the one case that matters for "no timeout":
// a 401 means the token was genuinely revoked or expired (not "15 minutes
// passed"), so that's the only time we force the user back to login.

import { API_BASE } from '../config';
import { getSession, clearSession } from '../db/tokenStore';

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const session = await getSession();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Not JSON (e.g. network layer / proxy error page) — surface a clean error
  // instead of letting JSON.parse throw somewhere deep in a component.
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('network_error');
  }

  if (res.status === 401) {
    await clearSession();
    onUnauthorized();
    throw new Error(data.error || 'unauthorized');
  }

  if (!res.ok) {
    throw new Error(data.error || 'request_failed');
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
