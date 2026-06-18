import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  site: 'https://www.rentease9ja.com',
  build: {
    format: 'file', // emit /buy.html instead of /buy/index.html → matches existing pretty-URL setup
  },
});
