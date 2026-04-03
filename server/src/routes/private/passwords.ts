import { Router } from 'express';
import { PasswordController } from '../../controllers/index.js';
import type { PasswordData } from '../../models/index.js';

const router = Router();

// ─── GET /api/private/passwords ────────────────────────────────────────────

export type PasswordResponseData = PasswordData;

export interface PasswordListResponseData {
  passwords: PasswordData[];
}

router.get('/', PasswordController.getAll);

// ─── GET /api/private/passwords/:id ────────────────────────────────────────

router.get('/:id', PasswordController.getOne);

// ─── POST /api/private/passwords ───────────────────────────────────────────

export interface CreatePasswordRequestBody {
  title: string;
  username?: string | null;
  password: string;
  website?: string | null;
  notes?: string | null;
  category?: string | null;
}

router.post('/', PasswordController.create);

// ─── PUT /api/private/passwords/:id ────────────────────────────────────────

export interface UpdatePasswordRequestBody {
  title?: string;
  username?: string | null;
  password?: string;
  website?: string | null;
  notes?: string | null;
  category?: string | null;
}

router.put('/:id', PasswordController.update);

// ─── DELETE /api/private/passwords/:id ─────────────────────────────────────

export interface DeletePasswordResponseData {
  message: string;
}

router.delete('/:id', PasswordController.delete);

export { router as passwordsRouter };
