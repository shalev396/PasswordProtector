import { Router } from 'express';
import { AccountController } from '../../controllers/index.js';

const router = Router();

// ─── GET /api/private/me ────────────────────────────────────────────────────

export interface MeResponseData {
  id: string;
  cognitoSub: string;
  email: string;
  name: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

router.get('/me', AccountController.getMe);

// ─── DELETE /api/private/delete ─────────────────────────────────────────────

export interface DeleteUserResponseData {
  message: string;
}

router.delete('/delete', AccountController.deleteAccount);

export { router as accountRouter };
