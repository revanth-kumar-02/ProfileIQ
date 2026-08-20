import { Request, Response } from 'express';
import { profileIngestionService } from '../services/ingestion/profileIngestion.service.js';

export async function handleProfileImport(req: Request, res: Response): Promise<void> {
  const { profileUrl, candidateName } = req.body || {};

  console.log(`[Profile Import Controller] Received payload for URL: "${profileUrl || ''}"`);

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

  // Validate LinkedIn URL syntax
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

    // Include diagnostics in development mode
    const isDev = process.env.NODE_ENV !== 'production';
    const responsePayload = {
      ...result,
      diagnostics: isDev ? result.diagnostics : undefined,
    };

    if (!result.success) {
      let statusCode = 422;
      const errorCode = result.error?.code;

      if (errorCode === 'INVALID_PROFILE_URL' || errorCode === 'PROVIDER_BAD_REQUEST') {
        statusCode = 400;
      } else if (errorCode === 'PROVIDER_AUTH_ERROR') {
        statusCode = 401;
      } else if (errorCode === 'PROFILE_LOGIN_REQUIRED' || errorCode === 'PROFILE_NOT_PUBLIC') {
        statusCode = 403;
      } else if (errorCode === 'PROFILE_DATA_NOT_AVAILABLE') {
        statusCode = 404;
      } else if (errorCode === 'PROFILE_ACCESS_BLOCKED' || errorCode === 'PROVIDER_RATE_LIMITED') {
        statusCode = 429;
      } else if (errorCode === 'NETWORK_ERROR') {
        statusCode = 502;
      } else if (errorCode === 'PROVIDER_UNAVAILABLE' || errorCode === 'PROVIDER_NOT_CONFIGURED') {
        statusCode = 503;
      } else if (errorCode === 'PROVIDER_TIMEOUT') {
        statusCode = 504;
      }

      res.status(statusCode).json(responsePayload);
      return;
    }

    res.status(200).json(responsePayload);
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
