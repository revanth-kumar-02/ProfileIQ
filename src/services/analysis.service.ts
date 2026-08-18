/**
 * ProfileIQ — Analysis Engine Service
 *
 * API client layer for executing intelligence analysis via ProfileIQ Backend.
 * Frontend sends normalized Profile & TargetRole to backend -> Backend runs Groq Analysis -> Returns ProfileAnalysis.
 */

import { Profile } from '../types/profile';
import { TargetRole } from '../types/role';
import { ProfileAnalysis } from '../types/analysis';
import { API_CONFIG } from '../config/apiConfig';

export interface AnalyzeProfileParams {
  profile: Profile;
  targetRole: TargetRole;
}

export class AnalysisService {
  /**
   * Run profile intelligence evaluation via ProfileIQ Backend.
   */
  static async analyzeProfile(params: AnalyzeProfileParams): Promise<ProfileAnalysis> {
    const { profile, targetRole } = params;

    const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyze}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          targetRole,
        }),
      });

      if (!response.ok) {
        let errorMsg = `Server responded with status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errorMsg = errData.error.message;
          }
        } catch {
          // fallback
        }
        throw new Error(errorMsg);
      }

      const resData = await response.json();
      if (!resData.success || !resData.data?.analysis) {
        throw new Error(resData.error?.message || 'Invalid response structure returned by backend');
      }

      return resData.data.analysis as ProfileAnalysis;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[AnalysisService] Backend API request failed (${apiUrl}): ${message}`);

      // Fallback local dynamic evaluation in case backend server is unreachable in offline/development mode
      return this.evaluateFallbackLocally(params);
    }
  }

  /**
   * Fallback client-side dynamic analysis generator (used only when backend API server is offline).
   */
  private static evaluateFallbackLocally(params: AnalyzeProfileParams): ProfileAnalysis {
    const { profile, targetRole } = params;
    const candidateName = profile.basicInfo.fullName || 'Candidate';
    const profileHeadline = profile.basicInfo.headline || 'Professional';
    const candidateSkills = profile.skills || [];
    const expectedSkills = targetRole.expectedSkills || ['TypeScript', 'React', 'Git', 'REST APIs', 'Problem Solving'];

    const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
    const strongSkills = expectedSkills.filter((skill) =>
      candidateSkillsLower.some((cs) => cs.includes(skill.toLowerCase()))
    );

    const missingSkills = expectedSkills.filter(
      (skill) => !candidateSkillsLower.some((cs) => cs.includes(skill.toLowerCase()))
    );

    const developingSkills = candidateSkills.filter(
      (skill) => !strongSkills.some((ss) => ss.toLowerCase() === skill.toLowerCase())
    );

    const skillMatchRatio = expectedSkills.length > 0 ? strongSkills.length / expectedSkills.length : 0.5;
    const hasProjects = profile.projects.length > 0;
    const hasExperience = profile.experience.length > 0;

    let rawScore = Math.round(skillMatchRatio * 50 + (hasProjects ? 25 : 0) + (hasExperience ? 25 : 0));
    rawScore = Math.min(Math.max(rawScore, 45), 95);

    const alignmentStatus = rawScore >= 80 ? 'strong' : rawScore >= 60 ? 'developing' : 'limited';
    const alignmentStatusLabel =
      rawScore >= 80 ? 'STRONG ALIGNMENT' : rawScore >= 60 ? 'DEVELOPING ALIGNMENT' : 'LIMITED ALIGNMENT';

    return {
      id: `analysis-${Date.now()}`,
      profileId: profile.id,
      profileUrl: profile.profileUrl,
      userName: candidateName,
      targetRole,
      overallAssessment: {
        status: alignmentStatus,
        summary: `Evaluated ${candidateName}'s profile against benchmark criteria for ${targetRole.title}. Candidate shows technical foundation with opportunity to optimize recruiter signals.`,
      },
      analysisHeadline: `Your profile shows technical foundations, but requires direct keyword positioning for ${targetRole.title}.`,
      executiveAssessment: `We evaluated ${candidateName}'s profile against target criteria for ${targetRole.title}. Demonstrates capability, but evidence should be quantified using measurable outcomes.`,
      alignment: {
        status: alignmentStatus,
        statusLabel: alignmentStatusLabel,
        alignmentScore: rawScore,
        dimensions: [
          { name: 'Technical Skills Match', status: `${strongSkills.length}/${expectedSkills.length} Matched`, score: Math.round(skillMatchRatio * 100), color: 'bg-[#004ac6]' },
          { name: 'Profile Headline Clarity', status: profileHeadline ? 'Extracted' : 'Needs Work', score: profileHeadline ? 75 : 30, color: 'bg-[#004ac6]' },
          { name: 'Project Evidence', status: hasProjects ? 'Verified' : 'Missing', score: hasProjects ? 85 : 20, color: hasProjects ? 'bg-[#004ac6]' : 'bg-rose-500' },
          { name: 'Work History Evidence', status: hasExperience ? 'Verified' : 'Missing', score: hasExperience ? 80 : 30, color: hasExperience ? 'bg-[#004ac6]' : 'bg-amber-500' },
          { name: 'Missing Signals', status: `${missingSkills.length} Gaps Detected`, score: Math.max(100 - missingSkills.length * 15, 20), color: missingSkills.length > 2 ? 'bg-rose-500' : 'bg-emerald-500' },
        ],
      },
      evidence: {
        strong: strongSkills.slice(0, 3).map((skill, idx) => ({
          id: `strong-${idx + 1}`,
          title: `${skill} Verified`,
          category: 'strength',
          explanation: `Explicit token detected in candidate profile: "${skill}".`,
          evidence: [`Verified skill: ${skill}`],
          whyItMatters: 'Matching keywords helps pass automated recruiter ATS filters.',
        })),
        developing: (developingSkills.length > 0 ? developingSkills : ['Technical Communication']).slice(0, 3).map((skill, idx) => ({
          id: `dev-${idx + 1}`,
          title: `${skill} Positioning`,
          category: 'developing',
          explanation: `Capabilities in ${skill} are visible, but require quantified evidence.`,
          evidence: [`Detected skill token: ${skill}`],
          whyItMatters: 'Quantified metrics distinguish top-tier candidates.',
        })),
        missing: (missingSkills.length > 0 ? missingSkills : ['Target Architecture']).slice(0, 3).map((skill, idx) => ({
          id: `miss-${idx + 1}`,
          title: `Not demonstrated in profile: ${skill}`,
          category: 'missing',
          explanation: `Expected signal for ${targetRole.title}, but token was not detected in profile.`,
          evidence: [`Expected benchmark signal: ${skill}`],
          whyItMatters: `Recruiters filter specifically for ${skill}.`,
        })),
      },
      priorities: [
        {
          id: 'prio-1',
          rank: '01',
          title: `Clarify Headline for ${targetRole.title}`,
          priority: 'high',
          impact: 'High Impact',
          impactColor: 'violet',
          description: `Align headline with recruiter search keywords for ${targetRole.title}.`,
          evidenceValue: `"${profileHeadline}"`,
          expectedValue: `Direct ${targetRole.title} Title`,
          relatedSection: 'headline',
          optimizationKey: 'headline',
        },
        {
          id: 'prio-2',
          rank: '02',
          title: 'Quantify Accomplishments using XYZ Formula',
          priority: 'high',
          impact: 'High Impact',
          impactColor: 'violet',
          description: 'Structure experience bullets around measurable impact.',
          evidenceValue: 'Experience / Projects Section',
          expectedValue: 'Quantified Impact Metrics',
          relatedSection: 'projects',
          optimizationKey: 'projects',
        },
      ],
      sections: [
        {
          id: 'headline',
          name: 'Headline',
          status: 'Needs Attention',
          statusType: 'error',
          whatWeFound: `Headline reads "${profileHeadline}". Reframe to target ${targetRole.title}.`,
          evidenceQuote: `"${profileHeadline}"`,
          whyThisMatters: 'Highest-weighted field in recruiter searches.',
          whatToDoNext: 'Specify your target role title and core stack.',
          optimizationKey: 'headline',
        },
        {
          id: 'about',
          name: 'About',
          status: 'Moderate',
          statusType: 'moderate',
          whatWeFound: 'About section provides general context.',
          whyThisMatters: 'Gives recruiters 30-second context.',
          whatToDoNext: 'Focus on core strengths and target direction.',
          optimizationKey: 'about',
        },
        {
          id: 'experience',
          name: 'Experience',
          status: 'Developing',
          statusType: 'developing',
          whatWeFound: `${profile.experience.length} experience entries found.`,
          whyThisMatters: 'Demonstrates work history.',
          whatToDoNext: 'Highlight technical outcomes.',
          optimizationKey: 'experience',
        },
        {
          id: 'skills',
          name: 'Skills',
          status: 'Strong Foundation',
          statusType: 'strong',
          whatWeFound: `${candidateSkills.length} skills listed.`,
          whyThisMatters: 'Keyword matching for ATS.',
          whatToDoNext: 'Group skills by domain.',
          optimizationKey: 'skills',
        },
        {
          id: 'projects',
          name: 'Projects',
          status: 'High Opportunity',
          statusType: 'opportunity',
          whatWeFound: `${profile.projects.length} project entries found.`,
          whyThisMatters: 'Proves coding capability.',
          whatToDoNext: 'Detail tech stack and architecture.',
          optimizationKey: 'projects',
        },
      ],
      roadmap: [
        { id: 'road-1', rank: '01', title: `Clarify headline for ${targetRole.title}`, description: 'Align with recruiter search filters', phase: 'NOW', optimizationKey: 'headline' },
        { id: 'road-2', rank: '02', title: 'Quantify project impact', description: 'Add metrics and tech stack details', phase: 'NOW', optimizationKey: 'projects' },
      ],
      optimizationDetails: {},
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
