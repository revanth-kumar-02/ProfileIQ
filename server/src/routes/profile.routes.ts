import { Router } from 'express';
import { handleProfileImport } from '../controllers/profileImport.controller.js';
import { handleGetProviderStatus } from '../controllers/providerStatus.controller.js';

const router = Router();

router.post('/import', handleProfileImport);
router.get('/provider-status', handleGetProviderStatus);

export default router;
