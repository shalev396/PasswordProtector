import type { LoginResponseData, MeResponseData } from '@api-types/api-contracts';

export type User = Omit<LoginResponseData['user'], 'name'>;
export type { MeResponseData as UserProfile };

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
