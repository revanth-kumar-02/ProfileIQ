# ProfileIQ — Profile Intelligence for Career Growth

*Understand what your profile communicates.*

---

## Overview

ProfileIQ is an AI-powered career intelligence application that audits profile semantic alignment, detects missing recruiter signals, and generates structured, prioritized optimization roadmaps for candidate career goals.

---

## Architecture

```text
React Frontend (Vite + TypeScript)
        │
        │ HTTP Request (POST /api/analysis)
        ▼
ProfileIQ Backend (Node.js + Express + TypeScript)
        │
        ├── Request Validation (Zod)
        ├── Profile Normalization (profileNormalizer)
        ├── Target Role Context Building (roleContext)
        ├── Analysis Orchestrator (analysisOrchestrator)
        ├── Groq AI Service (groqAnalysisService)
        ├── Response Validation (analysisValidator)
        └── Analysis Normalization (analysisNormalizer)
        │
        ▼
Groq API (Llama 3.3 70B / Configured Model)
        │
        ▼
Structured JSON Response
        │
        ▼
ProfileIQ Intelligence Report
```

- **Frontend**: React 19, TypeScript, Vanilla CSS + TailwindCSS 4, Motion animations.
- **Backend**: Node.js, Express, TypeScript, Zod, Groq SDK.
- **Security**: All LLM API calls and Groq credentials execute exclusively on the backend.

---

## Setup & Running Locally

### 1. Prerequisites
- Node.js v18+
- Groq API Key ([Get your API Key from Groq Console](https://console.groq.com/))

### 2. Environment Configuration

1. **Backend Environment**:
   Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` and add your Groq API Key:
   ```env
   PORT=3001
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   CLIENT_ORIGIN=http://localhost:3000
   ```

2. **Frontend Environment (Optional)**:
   By default, the frontend connects to `http://localhost:3001/api`. You can override it by setting:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

### 3. Installation

Install dependencies for both frontend and backend:
```bash
npm install
npm --prefix server install
```

### 4. Running the Development Servers

Start the backend server:
```bash
npm run server
```
*(Runs backend at `http://localhost:3001` with auto-reload)*

In a separate terminal, start the frontend:
```bash
npm run dev
```
*(Runs frontend at `http://localhost:3000`)*

---

## API Endpoints

### 1. Health Check
`GET /api/health`

Response:
```json
{
  "status": "ok",
  "service": "profileiq-api"
}
```

### 2. Execute Intelligence Analysis
`POST /api/analysis`

Request Body:
```json
{
  "profile": {
    "profileUrl": "https://www.linkedin.com/in/username",
    "basicInfo": {
      "fullName": "Jane Doe",
      "headline": "Software Engineer",
      "location": "San Francisco, CA"
    },
    "about": "Full stack developer...",
    "experience": [],
    "education": [],
    "skills": ["TypeScript", "React", "Node.js"],
    "projects": [],
    "certifications": []
  },
  "targetRole": {
    "id": "swe-intern",
    "title": "Software Engineer Intern"
  }
}
```

---

## Verification & Type Safety

Run full system lint and typechecks:
```bash
npm run lint
```

Build production bundles:
```bash
npm run build
```
