import "reflect-metadata"; // Must be imported first!
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/sequelize"; // Import the Sequelize connection function

dotenv.config();

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const app: Express = express();
  const port = process.env.PORT || 5000;

  // Middleware
  app.use(cors()); // Enable CORS for all routes
  app.use(express.json()); // Parse JSON bodies

  // Basic Route
  app.get("/", (req: Request, res: Response) => {
    res.send("Password Protector API Running!");
  });

  // TODO: Add Routers (e.g., app.use('/api/auth', authRoutes);)

  // Basic Error Handling Middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
