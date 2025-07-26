import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

export class User extends Model {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
  }
);

export default User;
