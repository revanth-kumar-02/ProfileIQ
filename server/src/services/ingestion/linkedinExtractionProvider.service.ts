import { getGroqClient, getGroqModel } from '../../config/groq.js';

export interface RawExtractedProfile {
  rawUrl: string;
  name?: string;
  headline?: string;
  about?: string;
  locationName?: string;
  photoUrl?: string;
  workHistory?: {
    companyName?: string;
    jobTitle?: string;
    dates?: string;
    descriptionText?: string;
  }[];
  educationHistory?: {
    schoolName?: string;
    degreeName?: string;
    dates?: string;
  }[];
  extractedSkills?: string[];
  portfolioProjects?: {
    title?: string;
    summary?: string;
    tags?: string[];
  }[];
  certifications?: {
    name?: string;
    issuer?: string;
  }[];
}

export interface ExtractionResult {
  success: boolean;
  data?: RawExtractedProfile;
  error?: {
    code: string;
    message: string;
  };
}

export interface ProfileExtractionProvider {
  extractProfile(profileUrl: string): Promise<ExtractionResult>;
}

export class LinkedInExtractionProvider implements ProfileExtractionProvider {
  async extractProfile(profileUrl: string): Promise<ExtractionResult> {
    const rawUrl = (profileUrl || '').trim();

    if (!rawUrl) {
      return {
        success: false,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
      };
    }

    // Validate LinkedIn URL syntax
    const isValidFormat =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl) ||
      /^linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl);

    if (!isValidFormat) {
      return {
        success: false,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).',
        },
      };
    }

    const cleanUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    console.log(`[Profile Import] URL received: ${cleanUrl}`);
    console.log('[Extraction] Provider started for LinkedIn URL');

    try {
      // 1. Fetch public profile content / meta headers
      let fetchedHtml = '';
      try {
        const response = await fetch(cleanUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        });
        if (response.ok) {
          fetchedHtml = await response.text();
        }
      } catch (err) {
        console.warn('[Extraction] Public fetch returned error or was restricted:', err instanceof Error ? err.message : String(err));
      }

      // Extract metadata tags if available
      const metaTitleMatch = fetchedHtml.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                             fetchedHtml.match(/<title>(.*?)<\/title>/i);
      const metaDescMatch = fetchedHtml.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                            fetchedHtml.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const metaImageMatch = fetchedHtml.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

      const titleContent = metaTitleMatch ? metaTitleMatch[1].replace(/\| LinkedIn.*$/i, '').trim() : '';
      const descContent = metaDescMatch ? metaDescMatch[1].trim() : '';
      const imageContent = metaImageMatch ? metaImageMatch[1].trim() : '';

      // Clean HTML body text (up to 3000 chars)
      const bodyText = fetchedHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 3000)
        .trim();

      const combinedText = `
URL: ${cleanUrl}
Title Meta: ${titleContent}
Description Meta: ${descContent}
Page Text Snippet: ${bodyText}
      `.trim();

      // 2. Extract profile data via Groq LLM parser
      const groq = getGroqClient();
      const model = getGroqModel();

      const prompt = `
Extract public profile information for candidate from this LinkedIn profile web data.

Profile Data:
${combinedText}

Return a STRICT JSON object matching this exact structure:
{
  "name": "Full name extracted from title/meta or null if not found",
  "headline": "Extracted professional headline or null if not found",
  "about": "Extracted summary/about section text or null if not found",
  "locationName": "Extracted location or null if not found",
  "photoUrl": "${imageContent || ''}" or null,
  "workHistory": [
    {
      "companyName": "Company name",
      "jobTitle": "Job title",
      "dates": "Start - End date",
      "descriptionText": "Key responsibilities"
    }
  ],
  "educationHistory": [
    {
      "schoolName": "University name",
      "degreeName": "Degree/Field",
      "dates": "Dates"
    }
  ],
  "extractedSkills": ["Skill 1", "Skill 2"],
  "portfolioProjects": [
    {
      "title": "Project name",
      "summary": "Project description",
      "tags": ["Tech 1"]
    }
  ]
}

STRICT EXTRACTION RULES:
1. ONLY extract information that is explicitly stated in the provided text.
2. DO NOT INVENT or fabricate candidate data under any circumstances.
3. DO NOT return fake demo names (e.g. "Revanth kumar", "Alex Chen", "Sarah Connor") unless that exact name was found in the text.
4. DO NOT return default skill arrays (e.g. ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Git", "REST APIs", "SQL"]) unless those exact skills were explicitly found.
5. If a section or skill is not present, return empty array [] or null.
`;

      const groqResponse = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an explicit LinkedIn profile data extractor. You strictly extract facts present in web text without hallucination.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const responseText = groqResponse.choices[0]?.message?.content || '{}';
      const parsedData = JSON.parse(responseText);

      // Check if candidate name was extracted from titleContent if Groq didn't find one
      let candidateName = parsedData.name?.trim();
      if (!candidateName && titleContent) {
        // e.g. "John Doe - Software Engineer" -> "John Doe"
        candidateName = titleContent.split('-')[0].split('|')[0].trim();
      }

      // If neither name nor headline nor about nor skills were found, the profile is private or unavailable
      const hasAnyExtractedData = Boolean(
        candidateName ||
        parsedData.headline ||
        parsedData.about ||
        (parsedData.extractedSkills && parsedData.extractedSkills.length > 0) ||
        (parsedData.workHistory && parsedData.workHistory.length > 0)
      );

      if (!hasAnyExtractedData) {
        console.log('[Extraction] No public data could be extracted from profile URL');
        return {
          success: false,
          error: {
            code: 'PROFILE_EXTRACTION_FAILED',
            message: "We couldn't extract public profile information from this LinkedIn URL. Make sure the profile is publicly accessible.",
          },
        };
      }

      const extractedSkills = (parsedData.extractedSkills || [])
        .map((s: unknown) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean);

      const rawData: RawExtractedProfile = {
        rawUrl: cleanUrl,
        name: candidateName || undefined,
        headline: parsedData.headline?.trim() || undefined,
        about: parsedData.about?.trim() || undefined,
        locationName: parsedData.locationName?.trim() || undefined,
        photoUrl: parsedData.photoUrl?.trim() || imageContent || undefined,
        workHistory: (parsedData.workHistory || []).map((w: any) => ({
          companyName: w.companyName?.trim() || undefined,
          jobTitle: w.jobTitle?.trim() || undefined,
          dates: w.dates?.trim() || undefined,
          descriptionText: w.descriptionText?.trim() || undefined,
        })).filter((w: any) => w.companyName || w.jobTitle),
        educationHistory: (parsedData.educationHistory || []).map((e: any) => ({
          schoolName: e.schoolName?.trim() || undefined,
          degreeName: e.degreeName?.trim() || undefined,
          dates: e.dates?.trim() || undefined,
        })).filter((e: any) => e.schoolName),
        extractedSkills: Array.from(new Set(extractedSkills)),
        portfolioProjects: (parsedData.portfolioProjects || []).map((p: any) => ({
          title: p.title?.trim() || undefined,
          summary: p.summary?.trim() || undefined,
          tags: (p.tags || []).map((t: any) => String(t).trim()).filter(Boolean),
        })).filter((p: any) => p.title),
      };

      console.log('[Extraction] Profile fields found:', {
        name: Boolean(rawData.name),
        headline: Boolean(rawData.headline),
        about: Boolean(rawData.about),
        skillsCount: rawData.extractedSkills?.length || 0,
        experienceCount: rawData.workHistory?.length || 0,
        educationCount: rawData.educationHistory?.length || 0,
      });

      return {
        success: true,
        data: rawData,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[Extraction Error]:', errMsg);
      return {
        success: false,
        error: {
          code: 'PROFILE_EXTRACTION_FAILED',
          message: `Profile extraction failed: ${errMsg}`,
        },
      };
    }
  }
}
