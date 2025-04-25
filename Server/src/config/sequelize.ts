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

// Lambda function timeout default is 6 seconds (6000 ms)
const LAMBDA_FUNCTION_TIMEOUT = 6000;

let sequelize: Sequelize | null = null;

const createSequelizeInstance = () => {
  return new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: "mssql",
    logging: false, // Set to console.log for debugging SQL queries
    dialectOptions: {
      options: {
        encrypt: dbEncrypt,
        trustServerCertificate: dbTrustServerCertificate,
      },
    },
    pool: {
      max: 2, // Reduced for Lambda to avoid too many connections
      min: 0, // Set to 0 so connections can be cleaned up
      acquire: 3000,
      idle: 0, // Set to 0 so connections are eligible for cleanup immediately
      evict: LAMBDA_FUNCTION_TIMEOUT, // Clean up connections after Lambda function timeout
    },
    models: [User, Password], // Pass model classes directly
  });
};

const getSequelize = async () => {
  if (!sequelize) {
    sequelize = createSequelizeInstance();
  } else {
    // Check if connection is still valid, otherwise reinitialize
    try {
      await sequelize.authenticate({ retry: { max: 0 } });
    } catch (error) {
      console.log("Reinitializing sequelize instance due to connection issues");
      // Create a fresh instance if there's an error
      try {
        if (sequelize.connectionManager) {
          // Close existing connections if any are still open
          await sequelize.connectionManager.close();
        }
      } catch (e) {
        console.log("Error closing existing connection manager:", e);
      }

      sequelize = createSequelizeInstance();
    }
  }

  return sequelize;
};

const connectDB = async () => {
  try {
    const sequelizeInstance = await getSequelize();

    // Try to authenticate but don't keep retrying if it fails
    await sequelizeInstance.authenticate({ retry: { max: 1 } });
    console.log("Sequelize Connection has been established successfully.");

    // Sync all models that aren't already in the database.
    // force: false will NOT drop existing tables
    await sequelizeInstance.sync({ force: false });
    console.log("All models were synchronized successfully.");

    return sequelizeInstance;
  } catch (error) {
    console.error("Unable to connect to the database via Sequelize:", error);

    // If the connection fails, we should reset our instance to ensure we don't reuse it
    sequelize = null;

    throw error;
  }
};

const closeConnection = async () => {
  if (sequelize) {
    try {
      // Only close if it's not already closed
      if (
        sequelize.connectionManager &&
        !sequelize.connectionManager.hasOwnProperty("getConnection")
      ) {
        await sequelize.connectionManager.close();
        console.log("Database connection closed successfully");
      }
    } catch (error) {
      console.error("Error closing database connection:", error);
    } finally {
      // After closing, we set sequelize to null for the next invocation
      sequelize = null;
    }
  }
};

export { getSequelize, connectDB, closeConnection };
