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

// ─── PUT /api/private/me ────────────────────────────────────────────────────

export interface UpdateMeRequestBody {
  name?: string;
}

export type UpdateMeResponseData = MeResponseData;

router.put('/me', AccountController.updateMe);

// ─── GET /api/private/me/export ──────────────────────────────────────────────
// Returns binary ZIP (application/zip) with Content-Disposition: attachment

router.get('/me/export', AccountController.exportMyData);

// ─── DELETE /api/private/delete ─────────────────────────────────────────────

export interface DeleteUserResponseData {
  message: string;
}

router.delete('/delete', AccountController.deleteAccount);

export { router as accountRouter };
