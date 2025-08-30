import { Request, Response } from 'express';
import { CompletionRequestSchema } from '@/types/completion';
import { createLogger } from '@/utils/logger';
import type { LLMBaseService } from '@/services/LLMBaseService';

const logger = createLogger(import.meta.url);

export class CompletionController {
  constructor(private llmService: LLMBaseService) {}

  async completion(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Received completion request');

      // Validate request body
      const validationResult = CompletionRequestSchema.safeParse(req.body);

      if (!validationResult.success) {
        logger.warn('Invalid request body', validationResult.error.errors);
        res.status(400).json({
          error: 'Invalid request body',
          details: validationResult.error.errors,
        });
        return;
      }

      const { input, params } = validationResult.data;

      logger.info(`Processing input: ${input.substring(0, 100)}...`);

      // Use the actual LLM service
      const messages = [
        {
          role: 'user' as const,
          content: input,
        },
      ];

      const response = await this.llmService.completion(messages, params);

      logger.info('Completion request processed successfully');

      res.json({
        content: response,
      });
    } catch (error) {
      logger.error('Error in completion endpoint:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  }
}
