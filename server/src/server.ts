import app from './app.js';
import { ENV } from './config/env.js';

app.listen(ENV.PORT, () => {
  console.log(`[ProfileIQ Server] Running at http://localhost:${ENV.PORT}`);
  console.log(`[ProfileIQ Server] Endpoints:`);
  console.log(`  - GET  http://localhost:${ENV.PORT}/api/health`);
  console.log(`  - POST http://localhost:${ENV.PORT}/api/analysis`);
  console.log(`  - POST http://localhost:${ENV.PORT}/api/profile/import`);
  console.log(`  - GET  http://localhost:${ENV.PORT}/api/profile/provider-status`);
  console.log(`[ProfileIQ Server] Configured Provider: ${ENV.PROFILE_EXTRACTION_PROVIDER}`);
  console.log(`[ProfileIQ Server] Groq Model: ${ENV.GROQ_MODEL}`);
});
