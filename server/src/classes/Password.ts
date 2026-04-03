import { getPasswordRepository, type PasswordData } from '../models/index.js';

export class Password {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _title: string;
  private readonly _username: string | null;
  private readonly _password: string;
  private readonly _website: string | null;
  private readonly _notes: string | null;
  private readonly _category: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: PasswordData) {
    this._id = data.id;
    this._userId = data.userId;
    this._title = data.title;
    this._username = data.username;
    this._password = data.password;
    this._website = data.website;
    this._notes = data.notes;
    this._category = data.category;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get username(): string | null {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get website(): string | null {
    return this._website;
  }

  get notes(): string | null {
    return this._notes;
  }

  get category(): string | null {
    return this._category;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON(): PasswordData {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      username: this._username,
      password: this._password,
      website: this._website,
      notes: this._notes,
      category: this._category,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static async findById(id: string): Promise<Password | null> {
    const repo = await getPasswordRepository();
    const data = await repo.findById(id);
    return data ? new Password(data) : null;
  }

  static async findAllByUserId(userId: string): Promise<Password[]> {
    const repo = await getPasswordRepository();
    const records = await repo.findAllByUserId(userId);
    return records.map((record) => new Password(record));
  }

  static async create(data: {
    userId: string;
    title: string;
    username: string | null;
    password: string;
    website: string | null;
    notes: string | null;
    category: string | null;
  }): Promise<Password> {
    const repo = await getPasswordRepository();
    const record = await repo.create(data);
    return new Password(record);
  }

  static async update(
    id: string,
    data: Partial<{
      title: string;
      username: string | null;
      password: string;
      website: string | null;
      notes: string | null;
      category: string | null;
    }>,
  ): Promise<Password> {
    const repo = await getPasswordRepository();
    const record = await repo.update(id, data);
    return new Password(record);
  }

  static async deleteById(id: string): Promise<void> {
    const repo = await getPasswordRepository();
    await repo.deleteById(id);
  }

  static async deleteAllByUserId(userId: string): Promise<void> {
    const repo = await getPasswordRepository();
    await repo.deleteAllByUserId(userId);
  }
}
