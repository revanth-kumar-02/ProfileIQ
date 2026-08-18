import app from './app.js';
import { ENV } from './config/env.js';

app.listen(ENV.PORT, () => {
  console.log(`[ProfileIQ Server] Running at http://localhost:${ENV.PORT}`);
  console.log(`[ProfileIQ Server] Health check available at http://localhost:${ENV.PORT}/api/health`);
  console.log(`[ProfileIQ Server] Groq Model: ${ENV.GROQ_MODEL}`);
});
