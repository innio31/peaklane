// src/config.js
// The single source of truth for "which school is this deployment". When
// cloning this repo for a new school, this file (+ vite.config.js manifest,
// + public/icons, + netlify.toml API proxy target) is everything that changes.

export const SCHOOL = {
  code: 'PLMS',
  name: 'Peak Lane Model School',
  colors: {
    primary: '#000080',
    secondary: '#FF0000',
    accent: '#FFFFFF',
  },
};

// In dev, Vite's proxy (vite.config.js) forwards this to acad.com.ng.
// In production on Netlify, netlify.toml redirects /acad-api/* the same way,
// so the app code never hardcodes the API host.
export const API_BASE = '/acad-api';
