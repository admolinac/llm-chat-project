/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import type { Application } from 'express';
import { createApp } from '@/app';
import getAppConfig from '@/config';
import { createLogger } from '@/utils/logger';
import { OpenAIService } from '@/services/OpenAIService';
import type { LLMBaseService } from '@/services/LLMBaseService';

const logger = createLogger(import.meta.url);

logger.info('Starting LLM Server');

class LLMServer {
  private app: Application;
  private llmService: LLMBaseService;

  constructor() {
    const appConfig = getAppConfig();
    logger.info(`Initializing LLM Server in ${appConfig.server.nodeEnv} mode`);

    // Initialize OpenAI service
    this.llmService = new OpenAIService(appConfig.openAI);
    logger.info('OpenAI service initialized');

    // Create app with LLM service
    this.app = createApp(this.llmService);
  }

  async start(): Promise<void> {
    const appConfig = getAppConfig();
    const { port, host } = appConfig.server;

    try {
      this.app.listen(port, () => {
        logger.info(`🚀 LLM Server running on http://${host}:${port}`);
        logger.info(
          `📊 Health check available at http://${host}:${port}/health`
        );
        logger.info(`🔧 Status available at http://${host}:${port}/status`);
        logger.info(
          `⚡ Completion endpoint at http://${host}:${port}/api/completion`
        );
        logger.info(`🤖 Using OpenAI model: ${appConfig.openAI.model}`);
      });
    } catch (error) {
      logger.error('Error starting server:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down LLM Server...');
    // Add cleanup logic here if needed
    logger.info('Server shut down completed');
  }
}

const server = new LLMServer();

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal');
  await server.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal');
  await server.shutdown();
  process.exit(0);
});

// Start server
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
