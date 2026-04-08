import type { LoginResponseData, MeResponseData } from '@api-types/api-contracts';

export type User = Omit<LoginResponseData['user'], 'name'>;
export type { MeResponseData as UserProfile };

export interface ApiRequestConfig {
  suppressErrorToast?: boolean;
}

/** Password item as returned by the list endpoint (no password field). */
export interface PasswordItem {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  website: string | null;
  notes: string | null;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** Full password item including the encrypted password (from single-fetch). */
export interface PasswordItemFull extends PasswordItem {
  password: string;
}
