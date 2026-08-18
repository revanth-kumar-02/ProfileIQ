import { getGroqClient } from '../../config/groq.js';
import { ENV } from '../../config/env.js';
import { SYSTEM_PROMPT, buildUserPrompt } from '../../prompts/profileAnalysis.prompt.js';
import { Profile, TargetRole } from '../../types/profile.types.js';
import { RoleContext } from '../roles/roleContext.service.js';

export interface AnalyzeGroqParams {
  profile: Profile;
  targetRole: TargetRole;
  roleContext: RoleContext;
}

export async function analyzeWithGroq(params: AnalyzeGroqParams): Promise<unknown> {
  const groq = getGroqClient();
  const userPrompt = buildUserPrompt(params);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: ENV.GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Groq returned empty completion response.');
    }

    try {
      return JSON.parse(content);
    } catch {
      // Strip any accidental markdown formatting if present
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse JSON response from Groq.');
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[GroqAnalysisService Error]:', errorMsg);
    throw new Error(`Groq API evaluation error: ${errorMsg}`);
  }
}
