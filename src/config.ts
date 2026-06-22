
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
export const DESKTOP_VERSION = 'v0.1.0';
export const DESKTOP_RELEASES_URL = 'https://github.com/Dammywx3/rentease-desktop-releases/releases';
export const DESKTOP_DOWNLOADS = {
  // macOS ships as two separate builds (no universal): Apple silicon + Intel.
  macArm:   'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent_0.1.0_aarch64.dmg',
  macIntel: 'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent_0.1.0_x64.dmg',
  windows:  'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent_0.1.0_x64_en-US.msi',
  linux:    'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent_0.1.0_amd64.AppImage',
  // Extra Linux formats (AppImage above is the universal default):
  linuxDeb: 'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent_0.1.0_amd64.deb',
  linuxRpm: 'https://github.com/Dammywx3/rentease-desktop-releases/releases/download/v0.1.0/RentEase.9ja.Agent-0.1.0-1.x86_64.rpm',
};
