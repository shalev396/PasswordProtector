import express from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import { body } from "express-validator";

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").optional(),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
];

// Public routes
router.post(
  "/register",
  registerValidation,
  register as express.RequestHandler
);
router.post("/login", loginValidation, login as express.RequestHandler);

// Protected routes
router.get(
  "/profile",
  authenticate as express.RequestHandler,
  getProfile as express.RequestHandler
);

export default router;
