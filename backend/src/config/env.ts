import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local .env

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'testtruth-dev-secret-key-32-chars-long-minimum',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MONGO_URI: process.env.MONGO_URI || '',
  ANALYSIS_ENGINE_URL: process.env.ANALYSIS_ENGINE_URL || 'http://localhost:8000',
  SANDBOX_TIMEOUT_MS: parseInt(process.env.SANDBOX_TIMEOUT_MS || '10000', 10),
  SANDBOX_MAX_MEMORY_MB: parseInt(process.env.SANDBOX_MAX_MEMORY_MB || '512', 10),
  USE_DOCKER_SANDBOX: process.env.USE_DOCKER_SANDBOX === 'true',
  AI_PROVIDER: process.env.AI_PROVIDER || 'none',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || '',
  AI_ENDPOINT: process.env.AI_ENDPOINT || '',
};

