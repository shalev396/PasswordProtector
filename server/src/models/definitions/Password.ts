export interface PasswordData {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  password: string;
  website: string | null;
  notes: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
    }>,
  ): Promise<PasswordData>;
  deleteById(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}

export const PASSWORD_TABLE_NAME = 'Passwords';
