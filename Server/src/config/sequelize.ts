import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User"; // Import the User model
import Password from "../models/Password"; // Import the Password model

dotenv.config();

const dbName = process.env.DB_DATABASE as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_SERVER || "localhost";
const dbEncrypt = process.env.DB_ENCRYPT === "true";
const dbTrustServerCertificate =
  process.env.DB_TRUST_SERVER_CERTIFICATE === "true";

if (!dbName || !dbUser || !dbPassword) {
  throw new Error(
    "Database credentials (DB_DATABASE, DB_USER, DB_PASSWORD) are missing in .env file"
  );
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mssql",
  logging: false, // Set to console.log for debugging SQL queries
  dialectOptions: {
    options: {
      encrypt: dbEncrypt,
      trustServerCertificate: dbTrustServerCertificate,
      // requestTimeout: 30000 // Optional: Increase request timeout if needed
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [User, Password], // Pass model classes directly
  // Or use models: [path.join(__dirname, '../models')] to load all models from the models directory
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize Connection has been established successfully.");

    // Sync all models that aren't already in the database.
    // force: false will NOT drop existing tables
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database via Sequelize:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
