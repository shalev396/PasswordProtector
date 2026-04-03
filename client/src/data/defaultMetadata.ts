import { app } from './app';

/**
 * Default page metadata. Sync with index.html for no-JS fallback (crawlers, disabled JS).
 * PageMetadata merges these with per-page overrides.
 */
export const DEFAULT_METADATA = {
  title: 'Password Protector | Secure Password Manager',
  description:
    'A zero-knowledge password manager with client-side encryption. Securely store, generate, and manage your passwords with AES-256-GCM encryption.',
  keywords: 'password manager, zero-knowledge, encryption, secure, AES-256, password generator',
  author: 'Password Protector',
  image: '/og-default.png',
  robots: 'index, follow' as const,
  ogType: 'website',
} as const;

/** Base URL for canonical and og:url. Use VITE_APP_URL if set, else origin at build time. */
export function getBaseUrl(): string {
  return app.baseUrl;
}
