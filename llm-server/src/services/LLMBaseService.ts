import { createLogger } from '@/utils/logger';
import type { ChatMessage } from '@/types/completion';
import type { LLMParams } from '@/types/llm-params';

const logger = createLogger(import.meta.url);

export abstract class LLMBaseService<TClient = unknown, TConfig = unknown> {
  protected abstract client: TClient;
  protected config: TConfig;

  constructor(config: TConfig) {
    this.config = config;
  }

  /**
   * Generate a completion based on a list of chat messages
   * @param messages - Array of chat messages
   * @param params - Optional LLM parameters (temperature, top_p, etc.)
   * @returns Promise with the completion response
   */
  abstract completion(
    messages: Array<ChatMessage>,
    params?: LLMParams
  ): Promise<string>;

  /**
   * Health check for the LLM service
   * @returns boolean indicating if the service is healthy
   */
  abstract healthCheck(): boolean;

  /**
   * Get available models from the LLM service
   * @returns Promise with array of available model names
   */
  abstract getModels(): Promise<Array<string>>;
}
