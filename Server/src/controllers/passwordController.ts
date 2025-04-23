import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Password from "../models/Password";
import User from "../models/User";
import crypto from "crypto";

// Helper function to encrypt passwords
const encryptPassword = (plainPassword: string, key: string): string => {
  const algorithm = "aes-256-ctr";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    key.substring(0, 32).padEnd(32, "0"),
    iv
  );

  let encrypted = cipher.update(plainPassword, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

// Helper function to decrypt passwords
const decryptPassword = (encryptedPassword: string, key: string): string => {
  const algorithm = "aes-256-ctr";
  const [ivHex, encryptedHex] = encryptedPassword.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key.substring(0, 32).padEnd(32, "0"),
    iv
  );

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

/**
 * Get all passwords for the authenticated user
 */
export const getAllPasswords = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const passwords = await Password.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json(passwords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a specific password by ID (with user verification)
 */
export const getPasswordById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const passwordId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (isNaN(passwordId)) {
      return res.status(400).json({ message: "Invalid password ID" });
    }

    const password = await Password.findOne({
      where: {
        id: passwordId,
        userId,
      },
    });

    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    return res.status(200).json(password);
  } catch (error) {
    console.error("Error fetching password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new password
 */
export const createPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors for password creation:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    

   

    // Ensure user exists in the request
    if (!req.user || !req.user.id) {
      console.error("User not found in request", {
        headers: {
          authorization: req.headers.authorization ? "present" : "missing",
          contentType: req.headers["content-type"],
        },
        path: req.path,
        method: req.method,
      });
      return res.status(401).json({
        message: "Unauthorized: User not found",
        details: "Authorization header may be missing or invalid",
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      console.error("User ID missing after auth check");
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found in database`);
      return res.status(404).json({ message: "User not found" });
    }

    
    const { title, username, password, website, notes, category } = req.body;

    // Create the password record with type assertion
    
    const newPassword = await Password.create({
      title,
      username,
      password,
      website,
      notes,
      category,
      userId,
    } as any);

    
    return res.status(201).json(newPassword);
  } catch (error) {
    console.error("Error creating password:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating password" });
  }
};

/**
 * Update an existing password
 */
export const updatePassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user?.id;
    const passwordId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (isNaN(passwordId)) {
      return res.status(400).json({ message: "Invalid password ID" });
    }

    // Find the password and ensure it belongs to this user
    const password = await Password.findOne({
      where: {
        id: passwordId,
        userId,
      },
    });

    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    // Update only the fields that were provided
    const {
      title,
      username,
      password: newPassword,
      website,
      notes,
      category,
    } = req.body;

    const updatedFields: any = {};
    if (title !== undefined) updatedFields.title = title;
    if (username !== undefined) updatedFields.username = username;
    if (newPassword !== undefined) updatedFields.password = newPassword;
    if (website !== undefined) updatedFields.website = website;
    if (notes !== undefined) updatedFields.notes = notes;
    if (category !== undefined) updatedFields.category = category;

    await password.update(updatedFields);

    return res.status(200).json(password);
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a password
 */
export const deletePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const passwordId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (isNaN(passwordId)) {
      return res.status(400).json({ message: "Invalid password ID" });
    }

    // Find the password and ensure it belongs to this user
    const password = await Password.findOne({
      where: {
        id: passwordId,
        userId,
      },
    });

    if (!password) {
      return res.status(404).json({ message: "Password not found" });
    }

    await password.destroy();

    return res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error("Error deleting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
