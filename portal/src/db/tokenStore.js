// src/db/tokenStore.js
//
// Persists the auth session in IndexedDB instead of localStorage. This is what
// makes "no session timeout" survive app restarts, device reboots, and being
// installed as a standalone PWA — localStorage can be cleared more aggressively
// by browsers under storage pressure; IndexedDB used by an installed PWA is
// treated as durable, user-owned storage.

import { openDB } from 'idb';

const DB_NAME = 'plms-auth';
const STORE = 'session';
const KEY = 'current';

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE);
      }
    },
  });
}

/** @param {{token:string, expires_at:string, user_type:string, role:string, user:object, school:object}} session */
export async function saveSession(session) {
  const database = await db();
  await database.put(STORE, session, KEY);
}

export async function getSession() {
  const database = await db();
  return (await database.get(STORE, KEY)) ?? null;
}

export async function clearSession() {
  const database = await db();
  await database.delete(STORE, KEY);
}
