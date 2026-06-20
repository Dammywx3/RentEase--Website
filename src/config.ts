// Single source of truth for backend + web-app hosts.
// Change the domain here once and it updates everywhere on the site.

// Where the site's forms (waitlist, contact, partners, investors, admin) POST.
// Override per build without editing code via the PUBLIC_API_BASE env var
// (e.g. an ngrok URL during local testing). Trailing slash is stripped.
export const API_BASE = (import.meta.env.PUBLIC_API_BASE || 'https://api.rentease9ja.com').replace(/\/+$/, '');

// The web-app host shown in marketing mockups (e.g. the laptop browser bar).
// Kept separate from API_BASE so a temporary ngrok API URL never leaks into the UI.
export const WEB_APP_HOST = 'app.rentease9ja.com';

// Support contact email (used by the contact modal).
export const SUPPORT_EMAIL = 'support@rentease9ja.com';

// WhatsApp business number in international format, digits only (e.g. '2348012345678').
// Leave empty to hide the WhatsApp contact button until you have a number.
export const WHATSAPP_NUMBER = '2347042421141';
