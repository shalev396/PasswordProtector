export interface PasswordData {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  password: string;
  website: string | null;
  notes: string | null;
  category: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Password data returned in list endpoints (password field excluded). */
export type PasswordListItemData = Omit<PasswordData, 'password'>;

export interface IPasswordRepository {
  findById(id: string): Promise<PasswordData | null>;
  findAllByUserId(userId: string): Promise<PasswordData[]>;
  create(data: {
    userId: string;
    title: string;
    username: string | null;
    password: string;
    website: string | null;
    notes: string | null;
    category: string | null;
    tags: string[];
  }): Promise<PasswordData>;
  update(
    id: string,
    data: Partial<{
      title: string;
      username: string | null;
      password: string;
      website: string | null;
      notes: string | null;
      category: string | null;
      tags: string[];
    }>,
  ): Promise<PasswordData>;
  deleteById(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}

export const PASSWORD_TABLE_NAME = 'Passwords';
