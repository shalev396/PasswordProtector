import type { LoginResponseData } from '@api-types/api-contracts';

export type User = LoginResponseData['user'];

export interface ApiRequestConfig {
  suppressErrorToast?: boolean;
}

export interface PasswordItem {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  password: string;
  website: string | null;
  notes: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}
