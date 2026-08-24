import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
// Static output (default `directory` format → clean URLs like /buy on any
// static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.).
// Build with `npm run build`; deploy the generated `dist/` folder.
export default defineConfig({
  site: 'https://rentease9ja.com',
  integrations: [sitemap()],
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data: https://images.unsplash.com https://*.tawk.to https://*.tawk.link",
        "font-src 'self' data: https://fonts.gstatic.com https://*.tawk.to",
        "connect-src 'self' https://api.rentease9ja.com https://plausible.io https://*.tawk.to https://*.tawk.link wss://*.tawk.to",
        "frame-src https://*.tawk.to https://*.tawk.link",
        "worker-src 'self' blob:",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://plausible.io', 'https://embed.tawk.to', 'https://*.tawk.to'],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://fonts.googleapis.com', kind: 'element' },
          { resource: 'https://*.tawk.to', kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
});
