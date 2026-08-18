/**
 * ProfileIQ — Target Role Service
 *
 * Provides career target roles for profile benchmarking.
 */

import { TargetRole } from '../types/role';

export const TARGET_ROLES: TargetRole[] = [
  {
    id: 'swe-intern',
    title: 'Software Engineer Intern',
    category: 'Early Career',
    description: 'Entry-level engineering roles focusing on data structures, algorithms, and web/systems projects.',
    expectedSkills: ['JavaScript', 'TypeScript', 'Python', 'React', 'Git', 'REST APIs', 'SQL', 'Data Structures'],
    importantKeywords: ['System Design', 'Unit Testing', 'CI/CD', 'Agile', 'Object Oriented Programming'],
    evidenceSignals: ['Git repositories', 'Personal projects', 'Technical coursework', 'Problem solving'],
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Web Development',
    description: 'Focusing on modern UI frameworks (React, Vue, TypeScript), responsive design, and state management.',
    expectedSkills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Next.js', 'Web Vitals'],
    importantKeywords: ['State Management', 'UI/UX Design', 'Cross-Browser Compatibility', 'Accessibility (a11y)'],
    evidenceSignals: ['Interactive web apps', 'Component libraries', 'Performance optimizations'],
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    category: 'Systems & APIs',
    description: 'Focusing on server-side logic, microservices, REST/GraphQL APIs, databases, and infrastructure.',
    expectedSkills: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Docker', 'REST APIs', 'GraphQL', 'Redis'],
    importantKeywords: ['Microservices', 'Database Schema', 'Authentication & OAuth', 'System Scalability'],
    evidenceSignals: ['API documentation', 'Database migrations', 'Server benchmarks'],
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    category: 'Engineering',
    description: 'Combining client UI engineering with robust server-side architecture and databases.',
    expectedSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Next.js', 'TailwindCSS', 'AWS'],
    importantKeywords: ['End-to-End Delivery', 'System Architecture', 'Database Design', 'Cloud Deployment'],
    evidenceSignals: ['Deployed SaaS projects', 'Full-stack repositories', 'System metrics'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Analytics',
    description: 'Focusing on SQL, Python/R, data visualization, business metrics, and statistical reporting.',
    expectedSkills: ['SQL', 'Python', 'Pandas', 'Tableau', 'PowerBI', 'Excel', 'Statistics', 'A/B Testing'],
    importantKeywords: ['Data Pipeline', 'Business Intelligence', 'Data Modeling', 'Data Hygiene'],
    evidenceSignals: ['Interactive dashboards', 'Data analysis reports', 'Case studies'],
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI & Data Science',
    description: 'Focusing on ML frameworks (PyTorch, TensorFlow), model deployment, NLP, and data pipelines.',
    expectedSkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Docker', 'MLOps', 'CUDA', 'NLP'],
    importantKeywords: ['Model Fine-Tuning', 'Feature Engineering', 'Model Deployment', 'Hyperparameter Tuning'],
    evidenceSignals: ['Model evaluation metrics', 'Research projects', 'Deployed AI pipelines'],
  },
];

export class RoleService {
  static async getTargetRoles(): Promise<TargetRole[]> {
    return TARGET_ROLES;
  }

  static async getRoleById(roleId: string): Promise<TargetRole | null> {
    const role = TARGET_ROLES.find((r) => r.id === roleId);
    return role || null;
  }
}
