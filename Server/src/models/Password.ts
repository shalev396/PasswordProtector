import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { User } from "./User.js";

export class Password extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public website?: string;
  public username?: string;
  public password!: string;
  public notes?: string;
  public category?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Password.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Passwords",
    timestamps: true,
  }
);

// Define associations
Password.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Password, {
  foreignKey: "userId",
  as: "passwords",
});

export default Password;
