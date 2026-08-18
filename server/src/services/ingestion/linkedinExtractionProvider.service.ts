import { getGroqClient, getGroqModel } from '../../config/groq.js';
import {
  ProfileExtractionProvider,
  ExtractionResult,
  RawExtractedProfile,
  ExtractionDiagnostics,
  PageTypeClassification,
  ExtractionErrorCode,
} from './types.js';

export class LinkedInExtractionProvider implements ProfileExtractionProvider {
  name = 'LinkedIn Direct Fetch Provider (Development)';

  async extractProfile(profileUrl: string): Promise<ExtractionResult> {
    const rawUrl = (profileUrl || '').trim();

    console.log(`\n[Profile Import] Requested URL: "${rawUrl}"`);

    if (!rawUrl) {
      console.log('[Validation] URL valid: false (Empty)');
      return {
        success: false,
        error: {
          code: 'INVALID_PROFILE_URL',
          message: 'Please enter a valid LinkedIn profile URL.',
        },
      };
    }

    // Validate syntax
    const isValidFormat =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl) ||
      /^linkedin\.com\/in\/[\w-]+\/?$/i.test(rawUrl);

    console.log(`[Validation] URL valid: ${isValidFormat}`);

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

    console.log(`[Extraction Provider] Provider started: ${this.name}`);

    let responseStatus: number | undefined;
    let responseContentType = 'unknown';
    let responseLength = 0;
    let redirectedUrl = cleanUrl;
    let fetchedHtml = '';
    let pageType: PageTypeClassification = 'unknown';

    try {
      // Direct HTTP Request to LinkedIn
      const fetchResponse = await fetch(cleanUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
      });

      responseStatus = fetchResponse.status;
      responseContentType = fetchResponse.headers.get('content-type') || 'unknown';
      redirectedUrl = fetchResponse.url || cleanUrl;

      fetchedHtml = await fetchResponse.text();
      responseLength = fetchedHtml.length;

      console.log(`[Extraction Provider] Request status: ${responseStatus}`);
      console.log(`[Extraction Provider] Response content type: ${responseContentType}`);
      console.log(`[Extraction Provider] Response length: ${responseLength} bytes`);
      console.log(`[Extraction Provider] Final URL: ${redirectedUrl}`);

      // Page Type Classification Logic
      pageType = this.classifyPageType(responseStatus, redirectedUrl, fetchedHtml);
      console.log(`[Extraction Provider] Detected page type: ${pageType}`);
    } catch (networkErr: unknown) {
      const errMsg = networkErr instanceof Error ? networkErr.message : String(networkErr);
      console.error(`[Extraction Provider] Network fetch failed: ${errMsg}`);

      const diagnostics: ExtractionDiagnostics = {
        provider: this.name,
        httpStatus: responseStatus,
        pageType: 'unknown',
        redirectedUrl: cleanUrl,
        responseContentType: 'none',
        responseLength: 0,
        profileSignalsDetected: {
          name: false,
          headline: false,
          about: false,
          skillsCount: 0,
          experienceCount: 0,
          educationCount: 0,
        },
      };

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to the LinkedIn profile URL. Please check your internet connection.',
        },
        diagnostics,
      };
    }

    // Diagnostics template
    const diagnostics: ExtractionDiagnostics = {
      provider: this.name,
      httpStatus: responseStatus,
      pageType,
      redirectedUrl,
      responseContentType,
      responseLength,
      profileSignalsDetected: {
        name: false,
        headline: false,
        about: false,
        skillsCount: 0,
        experienceCount: 0,
        educationCount: 0,
      },
    };

    // Handle classified page non-profile states
    if (pageType === 'blocked') {
      return {
        success: false,
        error: {
          code: 'PROFILE_ACCESS_BLOCKED',
          message:
            'LinkedIn blocked this automated extraction request (HTTP 999 / Security Wall). Direct server-side HTTP scraping is restricted by LinkedIn.',
        },
        diagnostics,
      };
    }

    if (pageType === 'auth_wall' || pageType === 'login') {
      return {
        success: false,
        error: {
          code: 'PROFILE_LOGIN_REQUIRED',
          message:
            'LinkedIn requires user authentication to view this profile. Please make sure the profile public visibility is enabled.',
        },
        diagnostics,
      };
    }

    if (pageType === 'challenge') {
      return {
        success: false,
        error: {
          code: 'PROFILE_ACCESS_BLOCKED',
          message: 'LinkedIn presented a bot security challenge (CAPTCHA). Automated extraction cannot proceed.',
        },
        diagnostics,
      };
    }

    if (pageType === 'empty') {
      return {
        success: false,
        error: {
          code: 'PROFILE_DATA_NOT_AVAILABLE',
          message: 'The requested page returned no usable content.',
        },
        diagnostics,
      };
    }

    // Extract Meta tags & Text snippet
    const metaTitleMatch =
      fetchedHtml.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
      fetchedHtml.match(/<title>(.*?)<\/title>/i);
    const metaDescMatch =
      fetchedHtml.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
      fetchedHtml.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const metaImageMatch = fetchedHtml.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

    const titleContent = metaTitleMatch ? metaTitleMatch[1].replace(/\| LinkedIn.*$/i, '').trim() : '';
    const descContent = metaDescMatch ? metaDescMatch[1].trim() : '';
    const imageContent = metaImageMatch ? metaImageMatch[1].trim() : '';

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

    // Parse via Groq LLM
    try {
      const groq = getGroqClient();
      const model = getGroqModel();

      const prompt = `
Extract public candidate profile facts from this LinkedIn web page snippet.

Data:
${combinedText}

Return a STRICT JSON object matching this structure:
{
  "name": "Extracted candidate name or null",
  "headline": "Extracted candidate headline or null",
  "about": "Extracted candidate summary/about or null",
  "locationName": "Extracted location or null",
  "photoUrl": "${imageContent || ''}" or null,
  "workHistory": [
    {
      "companyName": "Company",
      "jobTitle": "Role",
      "dates": "Dates",
      "descriptionText": "Details"
    }
  ],
  "educationHistory": [
    {
      "schoolName": "School",
      "degreeName": "Degree",
      "dates": "Dates"
    }
  ],
  "extractedSkills": ["Skill1"],
  "portfolioProjects": [
    {
      "title": "Project",
      "summary": "Summary",
      "tags": ["Tag"]
    }
  ]
}

STRICT INSTRUCTIONS:
1. ONLY extract information explicitly present in text.
2. DO NOT fabricate candidate names, skills, or experience under any circumstances.
3. If information is not present, return null or empty array [].
`;

      const groqResponse = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an explicit LinkedIn profile fact extractor. Do not fabricate data.',
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
      const parsed = JSON.parse(responseText);

      let candidateName = parsed.name?.trim();
      if (!candidateName && titleContent) {
        candidateName = titleContent.split('-')[0].split('|')[0].trim();
      }

      const extractedSkills = (parsed.extractedSkills || [])
        .map((s: unknown) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean);

      const workHistory = (parsed.workHistory || [])
        .map((w: any) => ({
          companyName: w.companyName?.trim() || undefined,
          jobTitle: w.jobTitle?.trim() || undefined,
          dates: w.dates?.trim() || undefined,
          descriptionText: w.descriptionText?.trim() || undefined,
        }))
        .filter((w: any) => w.companyName || w.jobTitle);

      const educationHistory = (parsed.educationHistory || [])
        .map((e: any) => ({
          schoolName: e.schoolName?.trim() || undefined,
          degreeName: e.degreeName?.trim() || undefined,
          dates: e.dates?.trim() || undefined,
        }))
        .filter((e: any) => e.schoolName);

      const portfolioProjects = (parsed.portfolioProjects || [])
        .map((p: any) => ({
          title: p.title?.trim() || undefined,
          summary: p.summary?.trim() || undefined,
          tags: (p.tags || []).map((t: any) => String(t).trim()).filter(Boolean),
        }))
        .filter((p: any) => p.title);

      const profileSignals = {
        name: Boolean(candidateName),
        headline: Boolean(parsed.headline),
        about: Boolean(parsed.about),
        skillsCount: extractedSkills.length,
        experienceCount: workHistory.length,
        educationCount: educationHistory.length,
      };

      diagnostics.profileSignalsDetected = profileSignals;

      console.log('[Parser] Name found:', profileSignals.name);
      console.log('[Parser] Headline found:', profileSignals.headline);
      console.log('[Parser] About found:', profileSignals.about);
      console.log('[Parser] Skills count:', profileSignals.skillsCount);
      console.log('[Parser] Experience count:', profileSignals.experienceCount);

      const hasAnySignals =
        profileSignals.name ||
        profileSignals.headline ||
        profileSignals.about ||
        profileSignals.skillsCount > 0 ||
        profileSignals.experienceCount > 0;

      if (!hasAnySignals) {
        console.log('[Extraction Provider] Page accessed but no profile signals detected');
        return {
          success: false,
          error: {
            code: 'PROFILE_DATA_NOT_AVAILABLE',
            message:
              'We accessed the page but could not find sufficient public profile information to analyze.',
          },
          diagnostics,
        };
      }

      const rawData: RawExtractedProfile = {
        rawUrl: cleanUrl,
        name: candidateName || undefined,
        headline: parsed.headline?.trim() || undefined,
        about: parsed.about?.trim() || undefined,
        locationName: parsed.locationName?.trim() || undefined,
        photoUrl: parsed.photoUrl?.trim() || imageContent || undefined,
        workHistory,
        educationHistory,
        extractedSkills: Array.from(new Set(extractedSkills)),
        portfolioProjects,
      };

      return {
        success: true,
        data: rawData,
        diagnostics,
      };
    } catch (parseErr: unknown) {
      const errMsg = parseErr instanceof Error ? parseErr.message : String(parseErr);
      console.error(`[Parser Error]: ${errMsg}`);
      return {
        success: false,
        error: {
          code: 'PROFILE_DATA_NOT_AVAILABLE',
          message: `Failed to parse extracted profile content: ${errMsg}`,
        },
        diagnostics,
      };
    }
  }

  private classifyPageType(status?: number, url?: string, html?: string): PageTypeClassification {
    if (status === 999 || (html && html.includes('trkCode=bf'))) {
      return 'blocked';
    }

    if (status === 403 || status === 429) {
      return 'blocked';
    }

    if (url && (url.includes('/authwall') || url.includes('/login') || url.includes('sign_in'))) {
      return 'auth_wall';
    }

    if (html && (html.includes('authwall') || html.includes('Sign In to LinkedIn') || html.includes('join-form'))) {
      return 'login';
    }

    if (html && (html.includes('captcha') || html.includes('security-check') || html.includes('challenge'))) {
      return 'challenge';
    }

    if (!html || html.trim().length === 0) {
      return 'empty';
    }

    if (html.includes('og:title') || html.includes('profile-displayphoto') || html.includes('pv-top-card')) {
      return 'profile';
    }

    return 'unknown';
  }
}
