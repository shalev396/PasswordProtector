import { body } from "express-validator";

// Validation rules for creating a new password
export const createPasswordValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("username")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Username cannot exceed 100 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 255 })
    .withMessage("Password cannot exceed 255 characters"),

  body("website")
    .optional()
    .isURL()
    .withMessage("Website must be a valid URL")
    .isLength({ max: 255 })
    .withMessage("Website cannot exceed 255 characters"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),

  body("category")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];

// Validation rules for updating an existing password
export const updatePasswordValidation = [
  body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("username")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Username cannot exceed 100 characters"),

  body("password")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Password cannot exceed 255 characters"),

  body("website")
    .optional()
    .isURL()
    .withMessage("Website must be a valid URL")
    .isLength({ max: 255 })
    .withMessage("Website cannot exceed 255 characters"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),

  body("category")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];
