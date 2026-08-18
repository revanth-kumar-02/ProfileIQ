import { Request, Response } from 'express';
import { profileIngestionService } from '../services/ingestion/profileIngestion.service.js';

export async function handleProfileImport(req: Request, res: Response): Promise<void> {
  const { profileUrl, candidateName } = req.body || {};

  if (!profileUrl || typeof profileUrl !== 'string' || !profileUrl.trim()) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PROFILE_URL',
        message: 'Please enter a valid LinkedIn profile URL.',
      },
    });
    return;
  }

  const trimmedUrl = profileUrl.trim();

  // Validate LinkedIn URL format
  const isValidLinkedinUrl =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(trimmedUrl) ||
    /^linkedin\.com\/in\/[\w-]+\/?$/i.test(trimmedUrl);

  if (!isValidLinkedinUrl) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PROFILE_URL',
        message: 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).',
      },
    });
    return;
  }

  try {
    const result = await profileIngestionService.importProfileFromUrl(trimmedUrl, candidateName);

    if (!result.success) {
      const statusCode = result.error?.code === 'INVALID_PROFILE_URL' ? 400 : 422;
      res.status(statusCode).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('[Profile Import Controller Error]:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while attempting to import your profile. Please try again.',
      },
    });
  }
}
