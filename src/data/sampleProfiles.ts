import { ProfileReport } from '../types';

export const defaultSoftwareEngineerReport: ProfileReport = {
  id: 'swe-intern-01',
  url: 'linkedin.com/in/alex-chen-swe',
  userName: 'Alex Chen',
  targetRole: 'Software Engineer Intern',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBuobs23FpWnLMrtJ9hU9k5J8AVSSZxfAY_m1pAAZEITz6LoWYBxKH3POKr5j3qB5DdKoZwF6RYrdSyy705t0iZ_7ZIRX6y6NfHuFaMzQaYShNgnBUiumUSpwt3VsPLcK4QakOZUZK6LNLLRFb9ek5So6QcpQSm061q9WgqBHT2yrpwyqxODcCUvjBkSMYAY2eia2Nw93MHIM0t15RFB3-baZGhbfHTp7H8yp30sY8XQD9inP0MmOtDQ',
  currentHeadline: 'Student | Developer',
  analysisHeadline: "Your profile has strong technical foundations, but it isn't communicating your professional direction clearly enough.",
  executiveSummary: "Your strongest evidence comes from your programming skills and personal projects. However, several important capabilities expected for your target role are either missing or not clearly demonstrated.",
  alignmentScore: 65,
  evidence: {
    strong: ['JavaScript', 'Python', 'Personal Projects'],
    developing: ['Data Structures', 'Project Impact'],
    missing: ['Testing', 'API Development', 'CI/CD']
  },
  improvements: [
    {
      id: 'imp-01',
      number: '01',
      impact: 'High Impact',
      impactColor: 'violet',
      title: 'Clarify your professional direction',
      description: 'Your current headline is too broad for someone targeting Software Engineering internships.',
      evidenceLabel: 'EVIDENCE',
      evidenceValue: '"Student | Developer"',
      expectedLabel: 'EXPECTED IMPROVEMENT',
      expectedValue: 'Better role clarity',
      optimizationKey: 'headline'
    },
    {
      id: 'imp-02',
      number: '02',
      impact: 'High Impact',
      impactColor: 'violet',
      title: 'Make your projects prove your skills',
      description: 'Your project descriptions lack concrete details about your specific contributions and outcomes.',
      evidenceLabel: 'EXPLANATION',
      evidenceValue: 'Explain Action + Technology + Impact to demonstrate true proficiency.',
      optimizationKey: 'projects'
    },
    {
      id: 'imp-03',
      number: '03',
      impact: 'Medium-High Impact',
      impactColor: 'secondary',
      title: 'Strengthen missing technical evidence',
      description: 'Key foundational technologies expected for this role are entirely absent from your profile.',
      missingEvidenceTags: ['Testing', 'REST APIs', 'Deployment'],
      optimizationKey: 'skills'
    }
  ],
  sections: [
    {
      id: 'headline',
      name: 'Headline',
      status: 'Needs Attention',
      statusType: 'error',
      whatWeFound: 'Your current headline relies heavily on generic job titles rather than communicating unique value or specialized expertise. It acts as a descriptor rather than a value proposition.',
      evidenceQuote: '"Senior Marketing Manager at Acme Corp | B2B & Digital Strategy"',
      whyThisMatters: 'The headline is the highest-weighted semantic field in recruiter searches. A generic title reduces your visibility in targeted searches for specialized roles and fails to differentiate you from peers at similar seniority levels.',
      whatToDoNext: 'Shift the focus from your current status to the outcomes you deliver.',
      optimizationKey: 'headline'
    },
    {
      id: 'about',
      name: 'About',
      status: 'Moderate',
      statusType: 'moderate',
      whatWeFound: 'Your summary provides a good overview of your coursework, but lacks a unifying narrative connecting your academic passions with real-world engineering challenges.',
      evidenceQuote: '"Computer Science undergraduate with an interest in web development, machine learning algorithms, and building software applications."',
      whyThisMatters: 'A high-impact About section gives recruiters the 30-second context on who you are, what problems you solve, and what technical environments you thrive in.',
      whatToDoNext: 'Structure your summary with: 1) Core identity & tech stack, 2) Key achievements/projects, 3) Clear career trajectory.',
      optimizationKey: 'about'
    },
    {
      id: 'experience',
      name: 'Experience',
      status: 'Developing',
      statusType: 'developing',
      whatWeFound: 'Prior teaching assistant and internship bullets focus heavily on daily responsibilities rather than quantitative impact or architectural decisions.',
      evidenceQuote: '"Assisted professors in grading assignments and held weekly lab sessions for 40+ students in introductory Python."',
      whyThisMatters: 'Hiring managers look for evidence of autonomy, problem-solving, and measurable outcomes even in early-career positions.',
      whatToDoNext: 'Reframe bullet points using the Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].',
      optimizationKey: 'experience'
    },
    {
      id: 'skills',
      name: 'Skills',
      status: 'Strong Foundation',
      statusType: 'strong',
      whatWeFound: 'Languages like JavaScript and Python are well-represented, but backend frameworks, database design, and testing libraries are under-indexed.',
      evidenceQuote: '"Skills listed: JavaScript, Python, HTML/CSS, Git, Problem Solving"',
      whyThisMatters: 'Recruiter search algorithms use exact skill token matches. Missing critical terms like REST APIs, SQL, or Jest can exclude your profile from search filters.',
      whatToDoNext: 'Reorganize skills into categorized groups (Languages, Frameworks, Developer Tools, Testing).',
      optimizationKey: 'skills'
    },
    {
      id: 'projects',
      name: 'Projects',
      status: 'High Opportunity',
      statusType: 'opportunity',
      whatWeFound: 'Projects are listed with basic titles but lack live URLs, GitHub repository links, system architecture notes, or user adoption metrics.',
      evidenceQuote: '"E-Commerce Web Application built with React and Node.js for class final project."',
      whyThisMatters: 'For internship candidates, portfolio projects serve as the primary proxy for production code experience and engineering maturity.',
      whatToDoNext: 'Add deployed demo links, highlight concurrency or API handling, and document key engineering trade-offs.',
      optimizationKey: 'projects'
    }
  ],
  roadmap: [
    {
      number: '01',
      title: 'Clarify headline',
      description: 'Ensure your headline immediately signals your intent and core competencies for software engineering.',
      phase: 'NOW',
      side: 'right'
    },
    {
      number: '02',
      title: 'Strengthen project descriptions',
      description: 'Quantify impact and detail specific technologies used in your key academic or personal projects.',
      phase: 'NOW',
      side: 'right'
    },
    {
      number: '03',
      title: 'Improve skill representation',
      description: 'Group skills logically and ensure relevant languages and frameworks are prominently featured.',
      phase: 'NEXT',
      side: 'left'
    },
    {
      number: '04',
      title: 'Add missing technical evidence',
      description: 'Link to GitHub repositories or live deployments to provide tangible proof of your coding abilities.',
      phase: 'NEXT',
      side: 'left'
    },
    {
      number: '05',
      title: 'Improve your About section',
      description: 'Craft a compelling narrative that connects your academic background, projects, and career aspirations.',
      phase: 'REFINE',
      side: 'right'
    }
  ],
  optimizationDetails: {
    headline: {
      key: 'headline',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Clarify your professional direction',
      subtitle: 'Refining the most prominent piece of your professional identity.',
      currentValue: '"Student | Developer"',
      currentLabel: 'CURRENT HEADLINE',
      whyLimitingParagraphs: [
        'The term "Student" immediately anchors your perceived value to inexperience, overshadowing your actual technical capabilities. While factual, it frames you as a learner rather than a contributor.',
        'Furthermore, "Developer" is overly broad. Without a specific technology stack, domain, or target role attached, recruiters and automated tracking systems struggle to index your profile for relevant opportunities.'
      ],
      formula: {
        targetDirection: '"Junior Frontend Engineer"',
        technicalStrength: '"React & TypeScript"',
        specialization: '"Accessible UI Design"'
      },
      generatedOptions: [
        {
          id: 'opt-01',
          headlineText: 'Frontend Developer | React & TypeScript | Building Accessible Web Experiences',
          bullets: [
            'Removes "Student" constraint, asserting professional capability.',
            'Highlights specific, in-demand technical stack for search indexing.'
          ]
        },
        {
          id: 'opt-02',
          headlineText: 'Software Engineering Graduate | Full-Stack JavaScript | Passionate about UI/UX',
          bullets: [
            'Reframes education as a completed milestone ("Graduate") rather than ongoing status.',
            'Broader scope appeal for full-stack entry-level roles.'
          ]
        },
        {
          id: 'opt-03',
          headlineText: 'Software Engineer Intern Candidate | TypeScript, Node.js & Cloud | Open Source Contributor',
          bullets: [
            'Explicitly targets internship keywords while highlighting backend and cloud competencies.',
            'Signals proactive collaboration through open source involvement.'
          ]
        }
      ]
    },
    projects: {
      key: 'projects',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Make your projects prove your skills',
      subtitle: 'Transforming academic projects into compelling production-grade evidence.',
      currentValue: '"E-Commerce Web Application built with React and Node.js for class final project."',
      currentLabel: 'CURRENT PROJECT DESCRIPTION',
      whyLimitingParagraphs: [
        'Academic project descriptions frequently read like homework assignments rather than engineering achievements.',
        'Without technical specifics—such as state management, database schema design, or API latency improvements—reviewers cannot gauge your architectural understanding.'
      ],
      formula: {
        targetDirection: '"Action Verb (Architected / Implemented)"',
        technicalStrength: '"Specific Stack & Architecture"',
        specialization: '"Measurable Performance or Metric"'
      },
      generatedOptions: [
        {
          id: 'opt-p1',
          headlineText: 'Full-Stack E-Commerce Engine | React, TypeScript, Node.js, PostgreSQL',
          bullets: [
            'Engineered RESTful API handling auth, inventory caching, and stripe checkout with 99.8% test coverage.',
            'Integrated Redis caching layer reducing database query latency by 42% under load testing.'
          ]
        },
        {
          id: 'opt-p2',
          headlineText: 'Distributed Task Queue System | Go, Redis, Docker, Prometheus',
          bullets: [
            'Built worker pool processing 5,000+ simulated concurrent jobs/sec with graceful error backoff.',
            'Deployed full CI/CD pipeline using GitHub Actions and containerized Docker images.'
          ]
        }
      ]
    },
    skills: {
      key: 'skills',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Strengthen missing technical evidence',
      subtitle: 'Closing the gap on high-leverage frameworks and testing methodologies.',
      currentValue: '"JavaScript, Python, HTML/CSS, Git"',
      currentLabel: 'CURRENT SKILLS MATRIX',
      whyLimitingParagraphs: [
        'Recruiter search filters specifically query for modern tooling ecosystems like Jest, React Testing Library, REST APIs, and CI/CD pipelines.',
        'Listing only generic programming languages without modern framework proficiency can trigger automatic ATS disqualification for internship screens.'
      ],
      formula: {
        targetDirection: '"Core Languages"',
        technicalStrength: '"Modern Frameworks & State"',
        specialization: '"Testing & Infrastructure"'
      },
      generatedOptions: [
        {
          id: 'opt-s1',
          headlineText: 'Frontend & UI Engineering Matrix',
          bullets: [
            'Languages: TypeScript, JavaScript (ES6+), Python, HTML5/CSS3',
            'Frameworks: React 18, Next.js, Tailwind CSS, Redux Toolkit',
            'Testing & Tooling: Jest, React Testing Library, Git, Vite, Webpack'
          ]
        },
        {
          id: 'opt-s2',
          headlineText: 'Full-Stack Systems Matrix',
          bullets: [
            'Backend: Node.js, Express, REST APIs, PostgreSQL, Prisma ORM',
            'DevOps & Cloud: Docker, GitHub Actions CI/CD, AWS S3, Vercel',
            'Quality: Unit Testing, TDD, API Integration Testing'
          ]
        }
      ]
    },
    about: {
      key: 'about',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Improve your About section',
      subtitle: 'Connecting your story, technical skills, and unique trajectory.',
      currentValue: '"Computer Science undergraduate with an interest in web development and software applications."',
      currentLabel: 'CURRENT ABOUT SUMMARY',
      whyLimitingParagraphs: [
        'A generic summary fails to differentiate your specific problem-solving mindset and passion.',
        'Engineering hiring managers look for candidates who express clear curiosity, self-driven learning, and collaborative instincts.'
      ],
      formula: {
        targetDirection: '"Who I Am & Core Stack"',
        technicalStrength: '"What I Have Built & Solved"',
        specialization: '"What I Am Seeking Next"'
      },
      generatedOptions: [
        {
          id: 'opt-a1',
          headlineText: 'Software Engineer | Passionate about Distributed Systems & High-Performance Web Apps',
          bullets: [
            'I am a Computer Science student dedicated to building robust, user-centric software. With hands-on experience in TypeScript, React, and Node.js, I enjoy breaking down complex problems into clean, modular code.',
            'Recently built a real-time collaborative workspace and contributed to open-source developer tooling. Actively seeking Software Engineer Intern opportunities for 2025/2026.'
          ]
        }
      ]
    },
    experience: {
      key: 'experience',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Elevate Experience with Measurable Impact',
      subtitle: 'Framing past roles with the XYZ impact formula.',
      currentValue: '"Assisted professors in grading assignments and held weekly lab sessions."',
      currentLabel: 'CURRENT EXPERIENCE ENTRY',
      whyLimitingParagraphs: [
        'Passive responsibility descriptions miss the chance to demonstrate leadership, empathy, and technical mentorship.',
        'Translating teaching or tutoring into engineering soft skills demonstrates high collaborative maturity.'
      ],
      formula: {
        targetDirection: '"Lead / Mentored"',
        technicalStrength: '"Core Subject Matter"',
        specialization: '"Measurable Student / Team Outcome"'
      },
      generatedOptions: [
        {
          id: 'opt-e1',
          headlineText: 'Undergraduate Computer Science Teaching Assistant',
          bullets: [
            'Mentored 40+ undergraduate students in data structures and algorithmic complexity (Python), improving class average lab test scores by 18%.',
            'Automated code grading validation scripts using Python test runners, saving 5+ hours of manual assessment time per weekly sprint.'
          ]
        }
      ]
    }
  },
  analyzedAt: 'Just now'
};

export const sampleProductManagerReport: ProfileReport = {
  id: 'pm-lead-02',
  url: 'linkedin.com/in/sarah-jenkins-pm',
  userName: 'Sarah Jenkins',
  targetRole: 'Senior Product Manager',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGmWH2x9rv7ZU1KJonx_b2XfmRYJlPInZr5NNhMYAYsw-7Lfwbezx6B4hXSfR9wFo7irFl1OIX9aondkMocD22xFIblC9HkRVc4VoNO5N_FhHvVjSP4hmqNAEge3lljM5PnQmhKgbDNdBueFwvarRl6oEKK-gFM7s2ZiXN60xbd3IhpSSONeRudSixWjfbloIv1Q4Sx-8qHQtCpHN_brS5hWV_fYvv3hHzMyJPQ3dWg-JsHadbLgLbXQ',
  currentHeadline: 'Senior Marketing Manager at Acme Corp | B2B & Digital Strategy',
  analysisHeadline: "Your profile demonstrates rich commercial experience, but needs clearer product leadership signals.",
  executiveSummary: "You have formidable B2B strategy and customer lifecycle evidence. To successfully transition to Senior Product Manager, highlight roadmap ownership, cross-functional engineering leadership, and product metrics.",
  alignmentScore: 72,
  evidence: {
    strong: ['Go-To-Market Strategy', 'User Analytics', 'Stakeholder Management'],
    developing: ['Technical Architecture Collaboration', 'Product Roadmapping'],
    missing: ['Sprint Execution (Scrum)', 'A/B Testing Frameworks', 'System Design Fundamentals']
  },
  improvements: [
    {
      id: 'imp-pm-01',
      number: '01',
      impact: 'High Impact',
      impactColor: 'violet',
      title: 'Clarify your product value proposition',
      description: 'Your headline currently positions you purely in marketing rather than end-to-end product ownership.',
      evidenceLabel: 'EVIDENCE',
      evidenceValue: '"Senior Marketing Manager at Acme Corp | B2B & Digital Strategy"',
      expectedLabel: 'EXPECTED IMPROVEMENT',
      expectedValue: 'Direct Product Leadership Framing',
      optimizationKey: 'headline'
    },
    {
      id: 'imp-pm-02',
      number: '02',
      impact: 'High Impact',
      impactColor: 'violet',
      title: 'Translate marketing campaigns into product feature launches',
      description: 'Frame past initiatives around user discovery, customer friction removal, and retention uplift.',
      evidenceLabel: 'EXPLANATION',
      evidenceValue: 'Highlight Problem Definition + Discovery Insights + Business Outcomes.',
      optimizationKey: 'projects'
    },
    {
      id: 'imp-pm-03',
      number: '03',
      impact: 'Medium-High Impact',
      impactColor: 'secondary',
      title: 'Bridge missing technical and agile product signals',
      description: 'Explicitly index agile methodologies, user story authoring, and analytics tooling.',
      missingEvidenceTags: ['Agile / Scrum', 'SQL & Amplitude', 'Feature Specs / PRDs'],
      optimizationKey: 'skills'
    }
  ],
  sections: [
    {
      id: 'headline',
      name: 'Headline',
      status: 'Needs Attention',
      statusType: 'error',
      whatWeFound: 'Your current headline relies heavily on generic job titles rather than communicating unique value or specialized expertise. It acts as a descriptor rather than a value proposition.',
      evidenceQuote: '"Senior Marketing Manager at Acme Corp | B2B & Digital Strategy"',
      whyThisMatters: 'The headline is the highest-weighted semantic field in recruiter searches. A generic title reduces your visibility in targeted searches for specialized roles and fails to differentiate you from peers at similar seniority levels.',
      whatToDoNext: 'Shift the focus from your current status to the outcomes you deliver.',
      optimizationKey: 'headline'
    },
    {
      id: 'about',
      name: 'About',
      status: 'Moderate',
      statusType: 'moderate',
      whatWeFound: 'Strong storytelling on company growth, but needs more focus on product discovery and cross-functional leadership with engineers.',
      evidenceQuote: '"Passionate marketing leader driving revenue growth across enterprise B2B SaaS accounts."',
      whyThisMatters: 'Senior PM recruiters look for product philosophies, user empathy, and data-informed decision frameworks.',
      whatToDoNext: 'Highlight your transition towards zero-to-one product initiatives and product-led growth (PLG).',
      optimizationKey: 'about'
    },
    {
      id: 'experience',
      name: 'Experience',
      status: 'Developing',
      statusType: 'developing',
      whatWeFound: 'Metrics are heavily commercial (leads, CAC, pipeline) rather than product adoption, retention, and feature velocity.',
      evidenceQuote: '"Managed $1.2M marketing budget and grew pipeline by 35% YoY across 3 verticals."',
      whyThisMatters: 'Product leaders evaluate your ability to drive feature adoption, reduce churn, and collaborate closely with engineering teams.',
      whatToDoNext: 'Add bullet points highlighting PRD creation, engineering sprint collaboration, and user retention gains.',
      optimizationKey: 'experience'
    },
    {
      id: 'skills',
      name: 'Skills',
      status: 'Strong Foundation',
      statusType: 'strong',
      whatWeFound: 'Excellent core business strategy and communication skills, with room to add technical analytics.',
      evidenceQuote: '"Skills: Product Marketing, Digital Strategy, Market Research, Customer Journeys"',
      whyThisMatters: 'Product roles require proven proficiency in product analytics platforms (Amplitude, Mixpanel) and SQL.',
      whatToDoNext: 'Add Product Strategy, User Story Mapping, A/B Testing, and Product Analytics.',
      optimizationKey: 'skills'
    },
    {
      id: 'projects',
      name: 'Projects',
      status: 'High Opportunity',
      statusType: 'opportunity',
      whatWeFound: 'Key cross-functional product launches are buried in general role descriptions.',
      evidenceQuote: '"Led the new customer portal rollout across sales and marketing teams."',
      whyThisMatters: 'Case-study style project summaries demonstrate strategic product thinking from discovery to delivery.',
      whatToDoNext: 'Document the customer problem, hypothesis, MVP rollout, and retention results.',
      optimizationKey: 'projects'
    }
  ],
  roadmap: [
    {
      number: '01',
      title: 'Clarify headline for Product Management',
      description: 'Rebrand from marketing manager to B2B SaaS Product Leader & Growth Strategist.',
      phase: 'NOW',
      side: 'right'
    },
    {
      number: '02',
      title: 'Frame case studies around product metrics',
      description: 'Reframe commercial achievements into MAU growth, feature adoption, and onboarding funnel optimization.',
      phase: 'NOW',
      side: 'right'
    },
    {
      number: '03',
      title: 'Index product management methodologies',
      description: 'Highlight discovery frameworks, PRD authoring, user interviews, and agile ceremonies.',
      phase: 'NEXT',
      side: 'left'
    },
    {
      number: '04',
      title: 'Demonstrate technical collaboration',
      description: 'Detail working relationships with engineering leads, system architects, and design systems.',
      phase: 'NEXT',
      side: 'left'
    },
    {
      number: '05',
      title: 'Elevate executive summary',
      description: 'Craft an authoritative narrative on bridging business strategy with intuitive product experiences.',
      phase: 'REFINE',
      side: 'right'
    }
  ],
  optimizationDetails: {
    headline: {
      key: 'headline',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Clarify your professional direction',
      subtitle: 'Refining the most prominent piece of your professional identity.',
      currentValue: '"Senior Marketing Manager at Acme Corp | B2B & Digital Strategy"',
      currentLabel: 'CURRENT HEADLINE',
      whyLimitingParagraphs: [
        'Your current headline categorizes you strictly within digital marketing, concealing your extensive product roadmap and user onboarding leadership.',
        'Recruiters filtering specifically for Senior Product Manager candidates will bypass profiles without clear product keywords in the primary title field.'
      ],
      formula: {
        targetDirection: '"Senior Product Manager"',
        technicalStrength: '"B2B SaaS & Product-Led Growth"',
        specialization: '"Driving Enterprise Retention & UX"'
      },
      generatedOptions: [
        {
          id: 'opt-pm-1',
          headlineText: 'Senior Product Manager | B2B SaaS & Enterprise Platforms | Scaling 0-to-1 Products',
          bullets: [
            'Directly targets Senior Product Management roles with clear B2B domain expertise.',
            'Signals capability to drive complex enterprise software workflows.'
          ]
        },
        {
          id: 'opt-pm-2',
          headlineText: 'Product Lead | PLG Strategy, User Discovery & Analytics | Ex-Acme Corp',
          bullets: [
            'Leverages past company reputation while establishing modern product-led growth credentials.',
            'Highlights analytical and customer discovery rigor.'
          ]
        }
      ]
    },
    projects: {
      key: 'projects',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Showcase Product Discovery & Launch Impact',
      subtitle: 'Structuring product initiatives with crisp problem-to-outcome narratives.',
      currentValue: '"Led the new customer portal rollout across sales and marketing teams."',
      currentLabel: 'CURRENT PROJECT ENTRY',
      whyLimitingParagraphs: [
        'Reviewers cannot tell if you owned the product specifications or simply supported the rollout communication.',
        'Clarifying your role in customer interviews, PRD ownership, and prioritization proves product authority.'
      ],
      formula: {
        targetDirection: '"Product Owner"',
        technicalStrength: '"Discovery & Engineering Execution"',
        specialization: '"Retention & Net Dollar Expansion"'
      },
      generatedOptions: [
        {
          id: 'opt-p-pm1',
          headlineText: 'Enterprise Self-Service Customer Portal | Zero-to-One Launch',
          bullets: [
            'Conducted 30+ enterprise customer discovery interviews to identify critical friction points in license provisioning.',
            'Partnered with 6-person engineering squad to deliver MVP in 4 months, driving 28% reduction in support ticket volume and 14% increase in expansion ARR.'
          ]
        }
      ]
    },
    skills: {
      key: 'skills',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Index Core Product Management Tooling',
      subtitle: 'Ensuring your skills section passes technical product scans.',
      currentValue: '"Product Marketing, Digital Strategy, Market Research"',
      currentLabel: 'CURRENT SKILLS MATRIX',
      whyLimitingParagraphs: [
        'Modern product leaders are expected to be hands-on with product analytics, user research repositories, and sprint tracking tools.',
        'Highlighting data fluency (SQL, Amplitude, Mixpanel) increases interview conversion rates dramatically.'
      ],
      formula: {
        targetDirection: '"Product Strategy"',
        technicalStrength: '"Execution & Analytics"',
        specialization: '"User Research & Design"'
      },
      generatedOptions: [
        {
          id: 'opt-s-pm1',
          headlineText: 'Product Leadership & Analytics Stack',
          bullets: [
            'Product Leadership: Roadmapping, PRDs, Opportunity Solution Trees, Agile/Scrum',
            'Data & Experimentation: Amplitude, Mixpanel, SQL, A/B Testing, Funnel Analytics',
            'Discovery & Design: User Interviews, Customer Journey Mapping, Figma'
          ]
        }
      ]
    },
    about: {
      key: 'about',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Craft an Authoritative Product Leadership Narrative',
      subtitle: 'Synthesizing commercial acumen with user empathy.',
      currentValue: '"Passionate marketing leader driving revenue growth across enterprise B2B SaaS accounts."',
      currentLabel: 'CURRENT ABOUT SUMMARY',
      whyLimitingParagraphs: [
        'Reframing your background as a commercial, data-driven Product Manager positions you as a rare, high-leverage hire who understands both user problems and business ROI.',
        'Clear, concise paragraphs establish executive presence.'
      ],
      formula: {
        targetDirection: '"Product Strategy Hook"',
        technicalStrength: '"Track Record of Scaled Systems"',
        specialization: '"Leadership Principles"'
      },
      generatedOptions: [
        {
          id: 'opt-a-pm1',
          headlineText: 'Product Leader with a Track Record of Scaling Enterprise SaaS',
          bullets: [
            'I build scalable, intuitive software products by combining rigorous user discovery with deep commercial empathy. Over the past 7 years, I have guided cross-functional squads to launch self-service enterprise platforms and product-led growth engines.',
            'Specialized in B2B SaaS, developer experience, and revenue-critical workflow optimization.'
          ]
        }
      ]
    },
    experience: {
      key: 'experience',
      badge: 'OPTIMIZATION DETAIL',
      title: 'Reframe Experience for Product Seniority',
      subtitle: 'Quantifying cross-functional velocity and strategic outcomes.',
      currentValue: '"Managed marketing budget and pipeline growth."',
      currentLabel: 'CURRENT EXPERIENCE ENTRY',
      whyLimitingParagraphs: [
        'Highlighting sprint delivery, backlog prioritization, and cross-functional leadership gives recruiters immediate proof of product management competence.',
        'Use the XYZ format to articulate business and user outcomes.'
      ],
      formula: {
        targetDirection: '"Spearheaded"',
        technicalStrength: '"Cross-Functional Delivery"',
        specialization: '"Customer Adoption & Retention"'
      },
      generatedOptions: [
        {
          id: 'opt-e-pm1',
          headlineText: 'Senior Product Manager / Product Lead',
          bullets: [
            'Defined multi-quarter product roadmap for core enterprise platform, delivering 4 major feature releases that increased weekly active accounts by 34%.',
            'Established bi-weekly customer feedback loops and prioritized sprint backlogs for an agile team of 8 engineers and 2 product designers.'
          ]
        }
      ]
    }
  },
  analyzedAt: '2 days ago'
};

export const sampleProfiles = [
  defaultSoftwareEngineerReport,
  sampleProductManagerReport
];
