import sequelize from "./sequelize.js";
import dotenv from "dotenv";
import "../models/User.js";
import "../models/Password.js";

// Configure dotenv in all environments now
dotenv.config();

if (
  process.env["ENV"] === "dev" //|| true // uncomment to sync database on PROD
) {
  await sequelize
    .sync({ alter: true })
    .then(() => console.log("✅ Database synchronized"))
    .catch((err) => console.error("❌ Sync error:", err));
}
