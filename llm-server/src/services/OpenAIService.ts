import OpenAI from 'openai';
import { LLMBaseService } from './LLMBaseService';
import { createLogger } from '@/utils/logger';
import type { OpenAIConfig } from '@/types/config';
import type { ChatMessage } from '@/types/completion';
import type { LLMParams } from '@/types/llm-params';

const logger = createLogger(import.meta.url);

export class OpenAIService extends LLMBaseService<OpenAI, OpenAIConfig> {
  protected client: OpenAI;
  private model: string;

  constructor(config: OpenAIConfig) {
    super(config);

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout,
      project: config.projectId,
    });

    this.model = config.model;
    logger.info(`OpenAI service initialized with model: ${this.model}`);
  }

  async completion(
    messages: Array<ChatMessage>,
    params?: LLMParams
  ): Promise<string> {
    try {
      logger.info(
        `Sending completion request to OpenAI with ${messages.length} messages`
      );

      // Build completion params with defaults and user overrides
      const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParams =
        {
          model: this.model,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: false, // No streaming as specified
          temperature: params?.temperature ?? 0.7,
          max_tokens: 1000,
        };

      // Add optional parameters if provided
      if (params?.top_p !== undefined) {
        completionParams.top_p = params.top_p;
      }

      // Note: top_k and reasoning_effort are not standard OpenAI parameters
      // but we include them for compatibility with other LLM providers
      if (params?.top_k !== undefined) {
        // For OpenAI compatibility, we could map this to other parameters or ignore
        logger.info(
          `top_k parameter (${params.top_k}) provided but not supported by OpenAI`
        );
      }

      if (params?.reasoning_effort !== undefined) {
        // For reasoning models like o1, this could be mapped to specific parameters
        logger.info(
          `reasoning_effort parameter (${params.reasoning_effort}) provided`
        );
      }

      const response =
        await this.client.chat.completions.create(completionParams);

      const completion = response.choices[0]?.message?.content || '';

      if (!completion) {
        throw new Error('No completion received from OpenAI');
      }

      logger.info(
        `OpenAI completion received: ${completion.substring(0, 100)}...`
      );
      return completion;
    } catch (error) {
      logger.error('Error in OpenAI completion:', error);

      if (error instanceof Error) {
        throw new Error(`OpenAI completion failed: ${error.message}`);
      }

      throw new Error('Unknown error in OpenAI completion');
    }
  }

  healthCheck(): boolean {
    try {
      return !!this.client;
    } catch (error) {
      logger.error('OpenAI health check failed:', error);
      return false;
    }
  }

  async getModels(): Promise<Array<string>> {
    try {
      const response = await this.client.models.list();
      return response.data.map((model) => model.id);
    } catch (error) {
      logger.error('Error fetching models from OpenAI:', error);
      return [];
    }
  }
}
