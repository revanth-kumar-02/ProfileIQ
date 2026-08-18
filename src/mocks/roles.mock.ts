/**
 * ProfileIQ — Target Roles Mock Data
 *
 * TEMPORARY DEVELOPMENT DATA — Replace with API response when backend is connected.
 *
 * This is the single source of truth for available target roles during development.
 * Components must import roles from this file via the role service, not hardcode them inline.
 */

import { TargetRole } from '../types';

export const MOCK_ROLES: TargetRole[] = [
  {
    id: 'role-swe-intern',
    title: 'Software Engineer Intern',
    category: 'Engineering',
    description: 'Entry-level software engineering internship focused on full-stack development.',
    expectedSkills: ['JavaScript', 'Python', 'Git', 'Data Structures', 'REST APIs'],
    importantKeywords: ['intern', 'software engineer', 'full-stack', 'frontend', 'backend'],
    evidenceSignals: ['personal projects', 'github', 'open source', 'algorithms'],
  },
  {
    id: 'role-spm',
    title: 'Senior Product Manager',
    category: 'Product',
    description: 'Leads product strategy, roadmap, and cross-functional delivery for complex products.',
    expectedSkills: ['Product Roadmapping', 'Agile/Scrum', 'SQL', 'A/B Testing', 'User Research'],
    importantKeywords: ['product manager', 'roadmap', 'PRD', 'product-led growth', 'stakeholder'],
    evidenceSignals: ['feature launches', 'retention metrics', 'OKRs', 'discovery'],
  },
  {
    id: 'role-fullstack',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    description: 'Builds end-to-end web applications across frontend and backend layers.',
    expectedSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
    importantKeywords: ['full-stack', 'full stack', 'web developer', 'MERN', 'PERN'],
    evidenceSignals: ['deployed apps', 'system design', 'API architecture', 'CI/CD'],
  },
  {
    id: 'role-ai-ml',
    title: 'AI / ML Engineer',
    category: 'Engineering',
    description: 'Designs and deploys machine learning models and AI-powered systems.',
    expectedSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Statistics'],
    importantKeywords: ['machine learning', 'deep learning', 'NLP', 'LLM', 'model training'],
    evidenceSignals: ['kaggle', 'research papers', 'model benchmarks', 'datasets'],
  },
  {
    id: 'role-data-scientist',
    title: 'Data Scientist',
    category: 'Data',
    description: 'Extracts insights from complex datasets to drive business decisions.',
    expectedSkills: ['Python', 'SQL', 'Statistics', 'Data Visualization', 'Machine Learning'],
    importantKeywords: ['data science', 'analytics', 'insights', 'hypothesis testing', 'EDA'],
    evidenceSignals: ['dashboards', 'A/B tests', 'forecasting models', 'Jupyter'],
  },
  {
    id: 'role-ux-designer',
    title: 'Product Designer (UI/UX)',
    category: 'Design',
    description: 'Designs intuitive, accessible product experiences from discovery to delivery.',
    expectedSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    importantKeywords: ['UX', 'UI', 'product design', 'user research', 'design system'],
    evidenceSignals: ['portfolio', 'case studies', 'wireframes', 'usability testing'],
  },
];
