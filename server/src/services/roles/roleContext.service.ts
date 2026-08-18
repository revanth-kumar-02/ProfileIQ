import { TargetRole } from '../../types/profile.types.js';

export interface RoleContext {
  roleId: string;
  title: string;
  category?: string;
  expectedSignals: string[];
  importantSkills: string[];
  optionalSignals: string[];
}

const ROLE_DICTIONARY: Record<string, RoleContext> = {
  'swe-intern': {
    roleId: 'swe-intern',
    title: 'Software Engineer Intern',
    category: 'Early Career',
    expectedSignals: [
      'Programming fundamentals (Data Structures & Algorithms)',
      'Object Oriented Programming or Functional Programming',
      'Personal, academic, or hackathon projects',
      'Git version control & collaborative workflow',
      'Unit testing awareness',
      'Basic REST API comprehension',
    ],
    importantSkills: [
      'JavaScript',
      'TypeScript',
      'Python',
      'React',
      'Git',
      'REST APIs',
      'SQL',
      'Data Structures',
    ],
    optionalSignals: ['CI/CD', 'Docker', 'System Design fundamentals'],
  },
  'frontend-dev': {
    roleId: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Web Engineering',
    expectedSignals: [
      'Modern UI Frameworks (React, Vue, or Angular)',
      'TypeScript & Modern JavaScript (ES6+)',
      'Semantic HTML5 & Responsive CSS Layouts',
      'State management architecture',
      'Web Vitals & Performance optimization',
      'REST/GraphQL API consumption',
    ],
    importantSkills: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'TailwindCSS',
      'Next.js',
      'Web Vitals',
    ],
    optionalSignals: ['Micro-frontends', 'Accessibility (a11y)', 'End-to-End Testing (Cypress/Playwright)'],
  },
  'backend-dev': {
    roleId: 'backend-dev',
    title: 'Backend Developer',
    category: 'Systems & Infrastructure',
    expectedSignals: [
      'Server-side runtime environments (Node.js, Python, Go, Java)',
      'Relational or NoSQL database schema design and querying',
      'RESTful or GraphQL API architectural design',
      'Authentication, Authorization & Security best practices',
      'Asynchronous task processing and queues',
      'Containerization (Docker) and deployment pipelines',
    ],
    importantSkills: [
      'Node.js',
      'Python',
      'Go',
      'PostgreSQL',
      'Docker',
      'REST APIs',
      'GraphQL',
      'Redis',
    ],
    optionalSignals: ['Microservices', 'Kubernetes', 'CI/CD Pipelines', 'System Scalability'],
  },
  'fullstack-dev': {
    roleId: 'fullstack-dev',
    title: 'Full Stack Developer',
    category: 'Engineering',
    expectedSignals: [
      'End-to-end web feature delivery (Client UI + Server API)',
      'Client-side state management & modern UI engineering',
      'Server-side business logic & database management',
      'Authentication flows and API security',
      'Deployment & CI/CD workflow',
    ],
    importantSkills: [
      'React',
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'Docker',
      'Next.js',
      'TailwindCSS',
      'AWS',
    ],
    optionalSignals: ['Serverless Functions', 'System Architecture', 'Performance Monitoring'],
  },
  'data-analyst': {
    roleId: 'data-analyst',
    title: 'Data Analyst',
    category: 'Analytics & BI',
    expectedSignals: [
      'Advanced SQL data querying & aggregation',
      'Data manipulation libraries (Python Pandas / R)',
      'Business intelligence dashboards (Tableau / Power BI)',
      'Statistical reporting & A/B testing evaluation',
      'Data hygiene and data storytelling',
    ],
    importantSkills: [
      'SQL',
      'Python',
      'Pandas',
      'Tableau',
      'PowerBI',
      'Excel',
      'Statistics',
      'A/B Testing',
    ],
    optionalSignals: ['Data Pipelines', 'Snowflake', 'dbt', 'BigQuery'],
  },
  'ml-engineer': {
    roleId: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI & Data Science',
    expectedSignals: [
      'Machine Learning Frameworks (PyTorch, TensorFlow, Scikit-Learn)',
      'Python scientific computing stack (NumPy, SciPy)',
      'Data preprocessing & feature engineering pipelines',
      'Model evaluation metrics & hyperparameter tuning',
      'MLOps & model deployment in production',
    ],
    importantSkills: [
      'Python',
      'PyTorch',
      'TensorFlow',
      'Scikit-Learn',
      'Docker',
      'MLOps',
      'CUDA',
      'NLP',
    ],
    optionalSignals: ['Vector Databases', 'LLM Fine-Tuning', 'Distributed Training'],
  },
};

export function getRoleContext(targetRole: TargetRole): RoleContext {
  const roleKey = targetRole.id?.toLowerCase();

  if (roleKey && ROLE_DICTIONARY[roleKey]) {
    return ROLE_DICTIONARY[roleKey];
  }

  // Look for match by title
  const matchedByKey = Object.values(ROLE_DICTIONARY).find(
    (r) => r.title.toLowerCase() === targetRole.title.toLowerCase()
  );
  if (matchedByKey) return matchedByKey;

  // Generic fallback for custom target roles
  const customSkills = targetRole.expectedSkills || [];
  const customKeywords = targetRole.importantKeywords || [];

  return {
    roleId: targetRole.id || 'custom-role',
    title: targetRole.title,
    category: targetRole.category || 'Custom Target Role',
    expectedSignals: [
      `Demonstrated capability in ${targetRole.title} core competencies`,
      'Relevant project or work history evidence',
      'Technical communication and domain clarity',
      'Problem solving and delivery capability',
    ],
    importantSkills: customSkills.length > 0 ? customSkills : [targetRole.title, 'Problem Solving', 'Domain Expertise'],
    optionalSignals: customKeywords.length > 0 ? customKeywords : ['Git', 'Documentation', 'System Design'],
  };
}
