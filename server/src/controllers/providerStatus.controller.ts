import { Request, Response } from 'express';
import { profileIngestionService } from '../services/ingestion/profileIngestion.service.js';

export async function handleGetProviderStatus(_req: Request, res: Response): Promise<void> {
  try {
    const statusData = await profileIngestionService.getProviderStatus();
    res.status(200).json({
      success: true,
      data: statusData,
    });
  } catch (error: any) {
    console.error('[Provider Status Controller Error]:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve provider status.',
      },
    });
  }
}
