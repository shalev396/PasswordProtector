import { UserModel } from './User.js';
import { PasswordModel } from './Password.js';

let initialized = false;

/**
 * Defines all Sequelize associations between models.
 * Must be called after all models are initialized and before sync.
 * Safe to call multiple times — associations are only set up once.
 */
export function defineAssociations(): void {
  if (initialized) {
    return;
  }
  initialized = true;
  // User hasMany Passwords (User.id -> Password.userId)
  UserModel.hasMany(PasswordModel, {
    foreignKey: 'userId',
    as: 'passwords',
    onDelete: 'CASCADE',
  });
  PasswordModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
  });
}
