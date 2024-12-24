import express, { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  getAllPasswords,
  getPasswordById,
  createPassword,
  updatePassword,
  deletePassword,
} from "../controllers/passwordController";
import {
  createPasswordValidation,
  updatePasswordValidation,
} from "../middleware/passwordValidation";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate as express.RequestHandler);

// Get all passwords for the authenticated user
router.get("/", (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getAllPasswords(req, res);
  } catch (error) {
    next(error);
  }
}) as express.RequestHandler);

// Get a specific password by ID
router.get("/:id", (async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getPasswordById(req, res);
  } catch (error) {
    next(error);
  }
}) as express.RequestHandler);

// Create a new password
router.post("/", createPasswordValidation, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createPassword(req, res);
  } catch (error) {
    next(error);
  }
}) as express.RequestHandler);

// Update a password
router.put("/:id", updatePasswordValidation, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updatePassword(req, res);
  } catch (error) {
    next(error);
  }
}) as express.RequestHandler);

// Delete a password
router.delete("/:id", (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deletePassword(req, res);
  } catch (error) {
    next(error);
  }
}) as express.RequestHandler);

export default router;
