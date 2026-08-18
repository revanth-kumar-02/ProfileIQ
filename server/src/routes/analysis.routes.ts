import { Router } from 'express';
import { analyzeProfileController } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/analysis', analyzeProfileController);

export default router;
