import { Router } from 'express';
import { accountRouter } from './account.js';
import { passwordsRouter } from './passwords.js';

const router = Router();

router.use('/passwords', passwordsRouter);
router.use('/', accountRouter);

export { router as privateRouter };
