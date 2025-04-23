import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";
import User from "./User"; // Import the User model

@Table({
  tableName: "Passwords",
  timestamps: true, // Enables createdAt and updatedAt fields
})
export class Password extends Model<Password> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // Define the foreign key relationship to User
  @AllowNull(false)
  @ForeignKey(() => User) // Establishes the foreign key constraint
  @Column({
    type: DataType.INTEGER,
    field: "user_id", // Explicitly map to the column name in the DB
  })
  userId!: number;

  // Define the many-to-one relationship back to User
  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title!: string;

  @Column(DataType.STRING(255))
  website?: string; // Optional field

  @Column(DataType.STRING(255))
  username?: string; // Optional field

  @AllowNull(false)
  @Column({
    type: DataType.TEXT, // Use TEXT for potentially long passwords
  })
  password!: string;

  @Column(DataType.TEXT) // Use TEXT for potentially long notes
  notes?: string; // Optional field

  @Column(DataType.STRING(100))
  category?: string; // Optional field

  // Timestamps are automatically handled by `timestamps: true`
  // createdAt!: Date;
  // updatedAt!: Date;
}

// Export the model as default
export default Password;
