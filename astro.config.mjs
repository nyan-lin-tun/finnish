import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://nyanlintun.me',
  base: '/finnish',
  trailingSlash: 'always',
  output: 'static',
  // Keep scripts external so Vite finalizes the dynamic import preload references.
  vite: { build: { assetsInlineLimit: 0 } },
});
