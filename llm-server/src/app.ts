import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createApiRoutes } from '@/routes';
import { createLogger } from '@/utils/logger';
import type { LLMBaseService } from '@/services/LLMBaseService';

const logger = createLogger(import.meta.url);

export const createApp = (llmService: LLMBaseService): express.Application => {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  // Logging
  app.use(
    morgan('combined', {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req: express.Request, res: express.Response) => {
    const isLLMHealthy = llmService.healthCheck();

    res.json({
      status: isLLMHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        llm: isLLMHealthy ? 'healthy' : 'unhealthy',
      },
    });
  });

  app.get('/status', (req: express.Request, res: express.Response) => {
    res.json({
      service: 'llm-server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // API routes with LLM service
  app.use('/api', createApiRoutes(llmService));

  // Error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Something went wrong',
      });
    }
  );

  return app;
};
