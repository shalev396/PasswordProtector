import { Router } from 'express';
import { dashboardRouter } from './dashboard.js';
import { accountRouter } from './account.js';
import { passwordsRouter } from './passwords.js';

const router = Router();

router.use('/dashboard', dashboardRouter);
router.use('/passwords', passwordsRouter);
router.use('/', accountRouter);

export { router as privateRouter };
