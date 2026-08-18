import { Router } from 'express';
import { handleProfileImport } from '../controllers/profileImport.controller.js';

const router = Router();

router.post('/import', handleProfileImport);

export default router;
