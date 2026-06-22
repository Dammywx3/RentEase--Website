
export const API_BASE = (import.meta.env.PUBLIC_API_BASE || 'https://api.rentease9ja.com').replace(/\/+$/, '');


export const WEB_APP_HOST = 'app.rentease9ja.com';

// Support contact email (used by the contact modal).
export const SUPPORT_EMAIL = 'support@rentease9ja.com';

// WhatsApp business number in international format, digits only (e.g. '2348012345678').
// Leave empty to hide the WhatsApp contact button until you have a number.
export const WHATSAPP_NUMBER = '2347042421141';

// Desktop app (agent/landlord workspace) installers.
// Recommended: publish to GitHub Releases, then paste the direct asset URLs here.
// Leave a URL empty to show that platform as "Coming soon".
export const DESKTOP_VERSION = '';                 // e.g. 'v1.0.0' (shown on the download page; empty hides it)
export const DESKTOP_RELEASES_URL = '';            // e.g. 'https://github.com/<owner>/<repo>/releases' (release-notes link)
export const DESKTOP_DOWNLOADS = {
  mac: '',      // .dmg  — e.g. '.../RentEase-9ja_1.0.0_universal.dmg'
  windows: '',  // .msi or .exe
  linux: '',    // .AppImage
};
