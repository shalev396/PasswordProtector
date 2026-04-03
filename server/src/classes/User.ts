import { getUserRepository, type UserData } from '../models/index.js';

export class User {
  private readonly _id: string;
  private readonly _cognitoSub: string;
  private readonly _name: string | null;
  private readonly _email: string | null;
  private readonly _lastLoginAt: Date | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: UserData) {
    this._id = data.id;
    this._cognitoSub = data.cognitoSub;
    this._name = data.name;
    this._email = data.email;
    this._lastLoginAt = data.lastLoginAt;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get cognitoSub(): string {
    return this._cognitoSub;
  }

  get name(): string | null {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON(): UserData {
    return {
      id: this._id,
      cognitoSub: this._cognitoSub,
      name: this._name,
      email: this._email,
      lastLoginAt: this._lastLoginAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static async findById(id: string): Promise<User | null> {
    const repo = await getUserRepository();
    const data = await repo.findById(id);
    return data ? new User(data) : null;
  }

  static async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    const repo = await getUserRepository();
    const data = await repo.findByCognitoSub(cognitoSub);
    return data ? new User(data) : null;
  }

  static async upsertFromLogin(
    cognitoSub: string,
    email: string | null,
    name: string | null,
  ): Promise<User> {
    const repo = await getUserRepository();
    const data = await repo.upsert({
      cognitoSub,
      email,
      name,
      lastLoginAt: new Date(),
    });
    return new User(data);
  }

  static async updateProfile(userId: string, data: { name?: string }): Promise<User> {
    const repo = await getUserRepository();
    const updated = await repo.updateProfile(userId, data);
    return new User(updated);
  }

  static async deleteAccount(userId: string): Promise<void> {
    const repo = await getUserRepository();
    await repo.deleteById(userId);
  }
}
