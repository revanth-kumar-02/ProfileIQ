# ProfileIQ

**Profile Intelligence for Career Growth**

*Understand what your profile communicates.*

---

## Overview

ProfileIQ is an AI-powered profile strategy engine that audits semantic alignment, detects missing evidence signals, and generates a structured, prioritized optimization roadmap for your target career goals.

## Architecture

```text
src/
├── types/          # Centralized TypeScript models (Profile, AnalysisResult, TargetRole)
├── services/       # API-ready service layer (ProfileService, AnalysisService, RoleService)
├── mocks/          # Isolated development mock layer
├── components/     # Reusable UI components
└── App.tsx         # Main application controller
```

## Running Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   `npm install`
2. Run the development server:
   `npm run dev`
3. Check type safety:
   `npm run lint`
