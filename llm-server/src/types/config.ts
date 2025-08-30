import { z } from 'zod';

// Environment validation schema
export const EnvironmentSchema = z.object({
  // Server
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535))
    .default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // OpenAI
  SERVER_OPENAI_API_KEY: z.string().min(1, 'SERVER_OPENAI_API_KEY required'),
  SERVER_OPENAI_PROJECT_ID: z
    .string()
    .min(1, 'SERVER_OPENAI_PROJECT_ID required'),
  SERVER_OPENAI_MODEL: z.string().default('gpt-3.5-turbo'),
  SERVER_OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  SERVER_OPENAI_TIMEOUT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1000))
    .default('60000'),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

// Server configuration schema
export const ServerConfigSchema = z.object({
  port: z.number().int().min(1).max(65535).default(3000),
  host: z.string().default('localhost'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  maxRequestSize: z.string().default('10mb'),
  corsOrigins: z.array(z.string()).or(z.literal('*')).default('*'),
  healthCheckEnabled: z.boolean().default(true),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

// OpenAI configuration schema (will be used in branch 2/openai-sdk)
export const OpenAIConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().default('gpt-3.5-turbo'),
  baseURL: z.string().url().default('https://api.openai.com/v1'),
  timeout: z.number().int().min(1000).default(60000),
  projectId: z.string().min(1, 'Project ID is required'),
});

export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;

// App configuration schema
export const AppConfigSchema = z.object({
  server: ServerConfigSchema,
  openAI: OpenAIConfigSchema, // Now required
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export const createConfigFromEnv = (): AppConfig => {
  // Validate environment variables
  const env = EnvironmentSchema.parse(process.env);

  // Build complete configuration
  const config: AppConfig = {
    server: {
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
      logLevel: env.LOG_LEVEL,
      host: 'localhost',
      maxRequestSize: '10mb',
      corsOrigins: '*',
      healthCheckEnabled: true,
    },
    // OpenAI config is now required and active
    openAI: {
      apiKey: env.SERVER_OPENAI_API_KEY,
      model: env.SERVER_OPENAI_MODEL,
      baseURL: env.SERVER_OPENAI_BASE_URL,
      timeout: env.SERVER_OPENAI_TIMEOUT,
      projectId: env.SERVER_OPENAI_PROJECT_ID,
    },
  };

  return AppConfigSchema.parse(config);
};
