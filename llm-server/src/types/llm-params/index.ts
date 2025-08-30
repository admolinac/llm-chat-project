import { z } from 'zod';

// LLM params compatible with OpenAI SDK
export const LLMParamsSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  top_k: z.number().int().min(1).optional(),
  reasoning_effort: z.number().int().min(1).max(10).optional(),
});

export type LLMParams = z.infer<typeof LLMParamsSchema>;
