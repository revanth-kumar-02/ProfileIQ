import { Request, Response } from 'express';
import { AnalysisOrchestratorService } from '../services/analysis/analysisOrchestrator.service.js';

export async function analyzeProfileController(req: Request, res: Response): Promise<void> {
  try {
    const analysis = await AnalysisOrchestratorService.runAnalysisPipeline(req.body);

    res.status(200).json({
      success: true,
      data: {
        analysis,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error during analysis execution';
    console.error('[AnalysisController Error]:', errorMsg);

    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYSIS_FAILED',
        message: "We couldn't complete the profile analysis. Please verify your profile inputs and try again.",
      },
    });
  }
}
