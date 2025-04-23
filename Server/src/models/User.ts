import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from "sequelize-typescript";
import Password from "./Password"; // Import the Password model

@Table({
  tableName: "Users",
  timestamps: true, // Enables createdAt and updatedAt fields
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique // Ensure email addresses are unique
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: "password_hash", // Explicitly map to the column name in the DB
  })
  passwordHash!: string;

  // Define the one-to-many relationship with Passwords
  @HasMany(() => Password)
  passwords!: Password[];

  // Timestamps are automatically handled by `timestamps: true`
  // createdAt!: Date;
  // updatedAt!: Date;
}

// Export the model as default
export default User;
