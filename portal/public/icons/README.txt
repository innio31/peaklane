icon-192.png and icon-512.png were copied straight from the existing
plms/assets/icons/android/ set — no regeneration needed, they already work.

icon-512-maskable.png is currently a plain copy of icon-512.png as a
placeholder. For a proper Android adaptive icon this needs the logo padded to
roughly the inner 80% of the canvas (safe zone), or Android's circular/squircle
mask will clip the edges. Regenerate it from plms/assets/logos/logo.png with
`npx pwa-asset-generator` or https://maskable.app/editor before shipping.
