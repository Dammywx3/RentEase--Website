// Single source of truth for backend + web-app hosts.
// Change the domain here once and it updates everywhere on the site.

// Where the site's forms (waitlist, contact, partners, investors, admin) POST.
// Override per build without editing code via the PUBLIC_API_BASE env var
// (e.g. an ngrok URL during local testing). Trailing slash is stripped.
export const API_BASE = (import.meta.env.PUBLIC_API_BASE || 'https://app.rentease9ja.com').replace(/\/+$/, '');

// The web-app host shown in marketing mockups (e.g. the laptop browser bar).
// Kept separate from API_BASE so a temporary ngrok API URL never leaks into the UI.
export const WEB_APP_HOST = 'app.rentease9ja.com';
