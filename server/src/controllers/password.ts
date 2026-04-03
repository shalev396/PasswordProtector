import { type RequestHandler } from 'express';
import { Password, User } from '../classes/index.js';
import type { AuthenticatedRequest } from '../types/express.js';
import type {
  PasswordResponseData,
  PasswordListResponseData,
  CreatePasswordRequestBody,
  UpdatePasswordRequestBody,
  DeletePasswordResponseData,
} from '../routes/private/passwords.js';
import { serverEncrypt, serverDecrypt, generateUserSeed } from '../utils/encryption.js';
import type { PasswordData } from '../models/index.js';

async function getUserSeed(userId: string): Promise<string> {
  const user = await User.findById(userId);
  if (user === null) {
    throw new Error('User not found');
  }

  if (user.encryptionSeed !== null && user.encryptionSeed !== '') {
    return user.encryptionSeed;
  }

  // First time: generate and store the seed
  const seed = generateUserSeed();
  await User.updateProfile(userId, { encryptionSeed: seed });
  return seed;
}

function decryptPasswordData(pw: PasswordData, seed: string): PasswordData {
  return {
    ...pw,
    password: serverDecrypt(pw.password, seed),
  };
}

const getAll: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const seed = await getUserSeed(userId);
    const passwords = await Password.findAllByUserId(userId);

    const data: PasswordListResponseData = {
      passwords: passwords.map((p) => decryptPasswordData(p.toJSON(), seed)),
    };

    res.success(data);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch passwords';
    res.error(errorMessage, 500);
  }
};

const getOne: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const id = req.params['id'] as string | undefined;

    if (id === undefined || id === '') {
      res.error('Password ID is required', 400);
      return;
    }

    const password = await Password.findById(id);

    if (password === null) {
      res.error('Password not found', 404);
      return;
    }

    if (password.userId !== userId) {
      res.error('Password not found', 404);
      return;
    }

    const seed = await getUserSeed(userId);
    const data: PasswordResponseData = decryptPasswordData(password.toJSON(), seed);

    res.success(data);
  } catch (error) {
    console.error('Error fetching password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch password';
    res.error(errorMessage, 500);
  }
};

const create: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const body = req.body as CreatePasswordRequestBody;

    if (body.title === '') {
      res.error('Title is required', 400);
      return;
    }

    if (body.password === '') {
      res.error('Password is required', 400);
      return;
    }

    const seed = await getUserSeed(userId);
    const encryptedPassword = serverEncrypt(body.password, seed);

    const password = await Password.create({
      userId,
      title: body.title,
      username: body.username ?? null,
      password: encryptedPassword,
      website: body.website ?? null,
      notes: body.notes ?? null,
      category: body.category ?? null,
    });

    // Return with server layer decrypted (client still needs to decrypt layer 1)
    const data: PasswordResponseData = decryptPasswordData(password.toJSON(), seed);

    res.success(data);
  } catch (error) {
    console.error('Error creating password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create password';
    res.error(errorMessage, 500);
  }
};

const update: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const id = req.params['id'] as string | undefined;

    if (id === undefined || id === '') {
      res.error('Password ID is required', 400);
      return;
    }

    const existing = await Password.findById(id);

    if (existing === null) {
      res.error('Password not found', 404);
      return;
    }

    if (existing.userId !== userId) {
      res.error('Password not found', 404);
      return;
    }

    const body = req.body as UpdatePasswordRequestBody;

    const updateData: Partial<{
      title: string;
      username: string | null;
      password: string;
      website: string | null;
      notes: string | null;
      category: string | null;
    }> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.category !== undefined) updateData.category = body.category;

    // Re-encrypt password with server layer if it changed
    const seed = await getUserSeed(userId);
    if (body.password !== undefined) {
      updateData.password = serverEncrypt(body.password, seed);
    }

    if (Object.keys(updateData).length === 0) {
      res.error('No changes provided', 400);
      return;
    }

    const updated = await Password.update(id, updateData);

    // Return with server layer decrypted
    const data: PasswordResponseData = decryptPasswordData(updated.toJSON(), seed);

    res.success(data);
  } catch (error) {
    console.error('Error updating password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
    res.error(errorMessage, 500);
  }
};

const deleteOne: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const id = req.params['id'] as string | undefined;

    if (id === undefined || id === '') {
      res.error('Password ID is required', 400);
      return;
    }

    const existing = await Password.findById(id);

    if (existing === null) {
      res.error('Password not found', 404);
      return;
    }

    if (existing.userId !== userId) {
      res.error('Password not found', 404);
      return;
    }

    await Password.deleteById(id);

    const data: DeletePasswordResponseData = {
      message: 'Password deleted successfully',
    };

    res.success(data);
  } catch (error) {
    console.error('Error deleting password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete password';
    res.error(errorMessage, 500);
  }
};

export const PasswordController = {
  getAll,
  getOne,
  create,
  update,
  delete: deleteOne,
} as const;
