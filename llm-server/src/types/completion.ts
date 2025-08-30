import { z } from 'zod';
import { LLMParamsSchema } from './llm-params';

// Completion request schema
export const CompletionRequestSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  params: LLMParamsSchema.optional(),
});

export type CompletionRequest = z.infer<typeof CompletionRequestSchema>;

// Completion response schema
export const CompletionResponseSchema = z.object({
  content: z.string(),
});

export type CompletionResponse = z.infer<typeof CompletionResponseSchema>;

// Chat message schema (for future use with OpenAI)
export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
