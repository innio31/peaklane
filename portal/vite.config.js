import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Peak Lane Model School — reference PWA build.
// One deployment = one school. To spin up another school, copy this whole
// folder, change APP config (see src/config.js) and the manifest below.

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Peak Lane Model School Portal',
        short_name: 'PLMS Portal',
        description: 'Peak Lane Model School — staff, admin, parent & student portal',
        theme_color: '#000080',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell (JS/CSS/HTML) cached for instant, app-like loads.
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        runtimeCaching: [
          {
            // API calls: network-first so data is fresh when online, but the
            // last known-good response is served if the network drops —
            // never a blank "offline" screen for someone mid-lesson-lookup.
            urlPattern: ({ url }) => url.pathname.startsWith('/acad-api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'acad-api-cache',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // Local dev: forward /acad-api/* to the real HostAfrica API so we never
      // hit CORS locally and never hardcode the API host in app code.
      '/acad-api': {
        target: 'https://acad.com.ng',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
