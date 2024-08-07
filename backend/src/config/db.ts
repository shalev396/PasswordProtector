import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER || "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // Use this if you're on Windows Azure
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true", // Change to true for local dev / self-signed certs
  },
};

let pool: sql.ConnectionPool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(sqlConfig).connect();
      console.log("SQL Server Connected...");
    }
    return pool;
  } catch (err: any) {
    console.error("SQL Server Connection Error:", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export { connectDB, pool };
