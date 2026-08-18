/**
 * ProfileIQ — Analysis Service
 *
 * API-ready service layer for executing intelligence analysis on profiles.
 * Will connect to backend Groq Analysis Engine in production.
 */

import { ProfileReport } from '../types';
import { MOCK_ANALYSIS_REPORTS } from '../mocks/analysis.mock';

export class AnalysisService {
  /**
   * Run profile analysis against target role benchmark.
   */
  static async analyzeProfile(
    url: string,
    targetRole: string,
    userName: string
  ): Promise<ProfileReport> {
    // Return structured report
    const newReport: ProfileReport = {
      id: `custom-${Date.now()}`,
      url: url.startsWith('http') ? url.replace(/^https?:\/\//, '') : url,
      userName: userName || 'Candidate',
      targetRole: targetRole,
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDHc-4-KJRNqqDk5bWPVfVxI7U_O0TrYsvUo59IEaPnlsoB7AYX0pLxkWUifhkzjFQ3XTYeuRPce_CLZ4W5pwqk-CRuVZeKIcFK46T_DRl8Gt__BakG3gouB3uoh_XR_jKCnubg0H_9T5DFd4WAs3FRJwm-nPvyhmcmnwnMiiE86FZ5WLI5dRUSHAZ2K6RKM5XY9qoqfAQ1h6NjwkvsnEY9LNGPkMYMrRS9G3fbmLQQfof7o8GFOGeyoA',
      currentHeadline: `Professional | Aspiring ${targetRole}`,
      analysisHeadline: `Your profile holds valuable foundations, but needs targeted alignment for ${targetRole}.`,
      executiveSummary: `We evaluated your profile against top benchmark performers in ${targetRole}. While your core aptitude is visible, your profile currently lacks the precise semantic keywords and quantifiable metrics recruiters filter for.`,
      alignmentScore: 68,
      evidence: {
        strong: ['Problem Solving', 'Domain Foundations', 'Core Collaboration'],
        developing: ['Role-Specific Impact', 'System Metrics'],
        missing: ['Target Architecture', 'Tooling Matrix', 'Verified Credentials'],
      },
      improvements: [
        {
          id: 'imp-c1',
          number: '01',
          impact: 'High Impact',
          impactColor: 'violet',
          title: `Position directly for ${targetRole}`,
          description: `Replace generic descriptors with high-signal keywords and specific tools expected in ${targetRole} screening.`,
          evidenceLabel: 'EVIDENCE',
          evidenceValue: `"Professional | Aspiring ${targetRole}"`,
          expectedLabel: 'EXPECTED IMPROVEMENT',
          expectedValue: `Direct ${targetRole} Value Proposition`,
          optimizationKey: 'headline',
        },
        {
          id: 'imp-c2',
          number: '02',
          impact: 'High Impact',
          impactColor: 'violet',
          title: 'Prove outcomes with the XYZ formula',
          description: 'Structure past accomplishments to explicitly showcase the scale, technologies, and measurable business impact.',
          evidenceLabel: 'EXPLANATION',
          evidenceValue: 'Accomplished [X] measured by [Y] by doing [Z]',
          optimizationKey: 'projects',
        },
        {
          id: 'imp-c3',
          number: '03',
          impact: 'Medium-High Impact',
          impactColor: 'secondary',
          title: `Integrate missing ${targetRole} skill tokens`,
          description: 'Add critical domain methodologies and modern framework keywords to pass automated screening filters.',
          missingEvidenceTags: ['Industry Frameworks', 'Metrics & KPIs', 'Cloud / CI/CD'],
          optimizationKey: 'skills',
        },
      ],
      sections: [
        {
          id: 'headline',
          name: 'Headline',
          status: 'Needs Attention',
          statusType: 'error',
          whatWeFound: `Your current headline relies on generic placeholders rather than positioning you as a capable ${targetRole}.`,
          evidenceQuote: `"Professional | Aspiring ${targetRole}"`,
          whyThisMatters: 'The headline is the highest-weighted semantic field in recruiter searches. It directly determines whether you appear in targeted candidate search results.',
          whatToDoNext: 'Specify your exact specialty, key technical stack, and the concrete value you bring.',
          optimizationKey: 'headline',
        },
        {
          id: 'about',
          name: 'About',
          status: 'Moderate',
          statusType: 'moderate',
          whatWeFound: 'Your summary provides a general overview, but misses a tailored value proposition connecting your background to this target role.',
          evidenceQuote: `"Experienced professional looking to leverage expertise in new challenges."`,
          whyThisMatters: 'Recruiters spend 6 to 8 seconds reviewing candidate profiles. A clear hook immediately establishes credibility.',
          whatToDoNext: 'Structure your summary: 1) Value statement, 2) Key achievements, 3) Core toolkit.',
          optimizationKey: 'about',
        },
        {
          id: 'experience',
          name: 'Experience',
          status: 'Developing',
          statusType: 'developing',
          whatWeFound: 'Role descriptions are task-focused rather than highlighting ownership, leadership, and quantitative results.',
          evidenceQuote: `"Responsible for daily team tasks and project deliverables."`,
          whyThisMatters: 'Hiring managers look for evidence of autonomy, initiative, and measurable impact.',
          whatToDoNext: 'Reframe bullet points using the Google XYZ impact formula.',
          optimizationKey: 'experience',
        },
        {
          id: 'skills',
          name: 'Skills',
          status: 'Strong Foundation',
          statusType: 'strong',
          whatWeFound: `Core competencies are listed, but modern ${targetRole} frameworks and tooling should be highlighted.`,
          evidenceQuote: '"Skills: Communication, Project Management, Analysis"',
          whyThisMatters: 'Recruiter search algorithms rely on exact skill token matches.',
          whatToDoNext: 'Group skills by domain (Core, Specialized Tools, Methodologies).',
          optimizationKey: 'skills',
        },
        {
          id: 'projects',
          name: 'Projects',
          status: 'High Opportunity',
          statusType: 'opportunity',
          whatWeFound: 'Key initiatives are mentioned without concrete architecture details or measurable performance outcomes.',
          evidenceQuote: '"Led strategic initiative for company operations."',
          whyThisMatters: 'Case-study style project descriptions prove real-world execution capability.',
          whatToDoNext: 'Highlight the problem, your technical solution, and the resulting business metrics.',
          optimizationKey: 'projects',
        },
      ],
      roadmap: [
        {
          number: '01',
          title: `Clarify headline for ${targetRole}`,
          description: `Align headline with exact recruiter search terms and competencies.`,
          phase: 'NOW',
          side: 'right',
          optimizationKey: 'headline',
        },
        {
          number: '02',
          title: 'Quantify project impact',
          description: 'Add measurable metrics (%, $, latency, scale) to key projects.',
          phase: 'NOW',
          side: 'right',
          optimizationKey: 'projects',
        },
        {
          number: '03',
          title: 'Organize skills matrix',
          description: 'Categorize core technologies and tools for ATS keyword indexing.',
          phase: 'NEXT',
          side: 'left',
          optimizationKey: 'skills',
        },
        {
          number: '04',
          title: 'Add external proof links',
          description: 'Link portfolio, GitHub, or case studies to demonstrate real-world impact.',
          phase: 'NEXT',
          side: 'left',
          optimizationKey: 'skills',
        },
        {
          number: '05',
          title: 'Elevate About section storytelling',
          description: 'Craft an authoritative narrative that positions you as a top candidate.',
          phase: 'REFINE',
          side: 'right',
          optimizationKey: 'about',
        },
      ],
      optimizationDetails: {
        headline: {
          key: 'headline',
          badge: 'OPTIMIZATION DETAIL',
          title: 'Clarify your professional direction',
          subtitle: `Refining your identity for ${targetRole}.`,
          currentValue: `"Professional | Aspiring ${targetRole}"`,
          currentLabel: 'CURRENT HEADLINE',
          whyLimitingParagraphs: [
            `The word "Aspiring" signals uncertainty in your qualification, causing recruiters to prioritize candidates with confident titles.`,
            `Without naming specific domain tools and specializations, your profile is omitted from targeted ATS keyword searches.`,
          ],
          formula: {
            targetDirection: `"${targetRole}"`,
            technicalStrength: '"Core Expertise & Methodologies"',
            specialization: '"Key Impact / Industry Focus"',
          },
          generatedOptions: [
            {
              id: 'opt-custom-1',
              headlineText: `${targetRole} | Specializing in Scalable Solutions & Modern Frameworks`,
              bullets: [
                'Directly indexes for high-frequency recruiter search terms.',
                'Projects immediate competence and domain ownership.',
              ],
            },
            {
              id: 'opt-custom-2',
              headlineText: `${targetRole} & Technical Specialist | Driving Measurable Product Impact`,
              bullets: [
                'Highlights analytical strength and business outcome focus.',
                'Strong fit for high-growth teams and tech organizations.',
              ],
            },
          ],
        },
      },
      analyzedAt: 'Just now',
    };

    return newReport;
  }

  static async getAnalysis(analysisId: string): Promise<ProfileReport | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const found = MOCK_ANALYSIS_REPORTS.find((r) => r.id === analysisId);
    return found || null;
  }
}
