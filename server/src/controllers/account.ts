import { type RequestHandler } from 'express';
import { User, Password } from '../classes/index.js';
import type { AuthenticatedRequest } from '../types/express.js';
import type {
  MeResponseData,
  UpdateMeResponseData,
  DeleteUserResponseData,
} from '../routes/private/account.js';
import { userAndPasswordsToCsv } from '../utils/csvUtil.js';
import { createUserExportZip } from '../utils/exportZipUtil.js';

const getMe: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const user = await User.findById(userId);

    if (user === null) {
      res.error('User not found', 404);
      return;
    }

    const data: MeResponseData = {
      id: user.id,
      cognitoSub: user.cognitoSub,
      email: user.email ?? '',
      name: user.name ?? '',
      lastLoginAt: user.lastLoginAt ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.success(data);
  } catch (error) {
    console.error('Error fetching user account:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account data';
    res.error(errorMessage, 500);
  }
};

const updateMe: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const user = await User.findById(userId);
    if (user === null) {
      res.error('User not found', 404);
      return;
    }

    const { name } = req.body as { name?: unknown };

    if (name === undefined) {
      res.error('No changes provided', 400);
      return;
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      res.error('Name must be a non-empty string', 400);
      return;
    }

    if (name.trim().length > 100) {
      res.error('Name must be 100 characters or fewer', 400);
      return;
    }

    const trimmedName = name.trim();

    if (trimmedName === user.name) {
      res.error('No changes provided', 400);
      return;
    }

    const updatedUser = await User.updateProfile(userId, { name: trimmedName });

    const data: UpdateMeResponseData = {
      id: updatedUser.id,
      cognitoSub: updatedUser.cognitoSub,
      email: updatedUser.email ?? '',
      name: updatedUser.name ?? '',
      lastLoginAt: updatedUser.lastLoginAt ?? null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.success(data);
  } catch (error) {
    console.error('Error updating user account:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
    res.error(errorMessage, 500);
  }
};

const exportMyData: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    const user = await User.findById(userId);
    if (user === null) {
      res.error('User not found', 404);
      return;
    }

    const passwordInstances = await Password.findAllByUserId(userId);
    const passwords = passwordInstances.map((p) => p.toJSON());
    const csv = userAndPasswordsToCsv(user.toJSON(), passwords);
    const zipBuffer = createUserExportZip(csv);

    const timestamp = String(Date.now());
    const filename = `user-export-${timestamp}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Response-Type', 'application/zip');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(zipBuffer);
  } catch (error) {
    console.error('Error exporting user data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
    res.error(errorMessage, 500);
  }
};

const deleteAccount: RequestHandler = async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;

    await User.deleteAccount(userId);

    const data: DeleteUserResponseData = {
      message: 'All user data has been permanently deleted',
    };

    res.success(data);
  } catch (error) {
    console.error('Error deleting user account:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user account';
    const statusCode = errorMessage === 'User not found' ? 404 : 500;
    res.error(errorMessage, statusCode);
  }
};

export const AccountController = {
  getMe,
  updateMe,
  exportMyData,
  deleteAccount,
} as const;
