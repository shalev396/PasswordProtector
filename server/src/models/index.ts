import type { IUserRepository } from './definitions/User.js';
import type { IPasswordRepository } from './definitions/Password.js';
import { environment } from '../config/environment.js';

export type { UserData, IUserRepository } from './definitions/User.js';
export type {
  PasswordData,
  PasswordListItemData,
  IPasswordRepository,
} from './definitions/Password.js';

let _userRepository: IUserRepository | null = null;
let _passwordRepository: IPasswordRepository | null = null;

export async function getUserRepository(): Promise<IUserRepository> {
  if (_userRepository !== null) {
    return _userRepository;
  }

  if (environment.databaseProvider === 'mongoose') {
    const { UserRepository } = await import('./mongoose/User.js');
    _userRepository = UserRepository;
  } else {
    const { UserRepository } = await import('./sequelize/User.js');
    _userRepository = UserRepository;
  }

  return _userRepository;
}

export async function getPasswordRepository(): Promise<IPasswordRepository> {
  if (_passwordRepository !== null) {
    return _passwordRepository;
  }

  if (environment.databaseProvider === 'mongoose') {
    throw new Error('Mongoose Password repository not implemented');
  } else {
    const { PasswordRepository } = await import('./sequelize/Password.js');
    _passwordRepository = PasswordRepository;
  }

  return _passwordRepository;
}
