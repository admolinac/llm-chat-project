import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIService } from '@/services/OpenAIService';
import type { OpenAIConfig } from '@/types/config';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
      models: {
        list: vi.fn(),
      },
    })),
  };
});

describe('OpenAIService', () => {
  const mockConfig: OpenAIConfig = {
    apiKey: 'test-api-key',
    projectId: 'test-project-id',
    model: 'gpt-3.5-turbo',
    baseURL: 'https://api.openai.com/v1',
    timeout: 60000,
  };

  let openAIService: OpenAIService;
  let mockOpenAI: any;

  beforeEach(() => {
    openAIService = new OpenAIService(mockConfig);
    mockOpenAI = openAIService['client'];
  });

  describe('completion', () => {
    it('should return completion from OpenAI API', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Hello! How can I help you today?',
            },
          },
        ],
      };

      vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue(
        mockResponse
      );

      const messages = [{ role: 'user' as const, content: 'Hello, world!' }];

      const result = await openAIService.completion(messages);

      expect(result).toBe('Hello! How can I help you today?');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, world!' }],
        stream: false,
        temperature: 0.7,
        max_tokens: 1000,
      });
    });

    it('should return completion with custom params', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Custom response with params',
            },
          },
        ],
      };

      vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue(
        mockResponse
      );

      const messages = [{ role: 'user' as const, content: 'Hello, world!' }];
      const params = {
        temperature: 0.9,
        top_p: 0.8,
        top_k: 40,
        reasoning_effort: 5,
      };

      const result = await openAIService.completion(messages, params);

      expect(result).toBe('Custom response with params');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, world!' }],
        stream: false,
        temperature: 0.9,
        top_p: 0.8,
        max_tokens: 1000,
      });
    });

    it('should throw error when no completion is received', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      vi.mocked(mockOpenAI.chat.completions.create).mockResolvedValue(
        mockResponse
      );

      const messages = [{ role: 'user' as const, content: 'Hello, world!' }];

      await expect(openAIService.completion(messages)).rejects.toThrow(
        'OpenAI completion failed: No completion received from OpenAI'
      );
    });

    it('should handle OpenAI API errors', async () => {
      const apiError = new Error('API quota exceeded');
      vi.mocked(mockOpenAI.chat.completions.create).mockRejectedValue(apiError);

      const messages = [{ role: 'user' as const, content: 'Hello, world!' }];

      await expect(openAIService.completion(messages)).rejects.toThrow(
        'OpenAI completion failed: API quota exceeded'
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true when client exists', () => {
      const result = openAIService.healthCheck();
      expect(result).toBe(true);
    });
  });

  describe('getModels', () => {
    it('should return list of available models', async () => {
      const mockModels = {
        data: [
          { id: 'gpt-3.5-turbo' },
          { id: 'gpt-4' },
          { id: 'text-davinci-003' },
        ],
      };

      vi.mocked(mockOpenAI.models.list).mockResolvedValue(mockModels);

      const result = await openAIService.getModels();

      expect(result).toEqual(['gpt-3.5-turbo', 'gpt-4', 'text-davinci-003']);
      expect(mockOpenAI.models.list).toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      vi.mocked(mockOpenAI.models.list).mockRejectedValue(
        new Error('API error')
      );

      const result = await openAIService.getModels();

      expect(result).toEqual([]);
    });
  });
});
