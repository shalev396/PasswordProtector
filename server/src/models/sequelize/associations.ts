import { UserModel } from './User.js';
import { PasswordModel } from './Password.js';

/**
 * Defines all Sequelize associations between models.
 * Must be called after all models are initialized and before sync.
 */
export function defineAssociations(): void {
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
