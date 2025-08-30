import express from 'express';
import { CompletionController } from '@/controllers/CompletionController';
import type { LLMBaseService } from '@/services/LLMBaseService';

export const createApiRoutes = (llmService: LLMBaseService): express.Router => {
  const router = express.Router();
  const completionController = new CompletionController(llmService);

  // POST /api/completion
  router.post('/completion', (req: express.Request, res: express.Response) => {
    completionController.completion(req, res);
  });

  return router;
};
