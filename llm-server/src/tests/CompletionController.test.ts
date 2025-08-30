import { describe, it, expect, vi } from 'vitest';
import { CompletionController } from '@/controllers/CompletionController';
import { LLMBaseService } from '@/services/LLMBaseService';

// Create a mock implementation of LLMBaseService
class MockLLMService extends LLMBaseService {
  protected client = {};

  completion = vi.fn();
  healthCheck = vi.fn();
  getModels = vi.fn();
}

describe('CompletionController', () => {
  const mockLLMService = new MockLLMService({});
  const controller = new CompletionController(mockLLMService);

  describe('completion', () => {
    it('should handle valid completion request with LLM params', async () => {
      // Mock the LLM service response
      vi.mocked(mockLLMService.completion).mockResolvedValue(
        'This is a test response with custom params'
      );

      const mockReq = {
        body: {
          input: 'Hello, world!',
          params: {
            temperature: 0.9,
            top_p: 0.8,
            top_k: 40,
            reasoning_effort: 5,
          },
        },
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockLLMService.completion).toHaveBeenCalledWith(
        [{ role: 'user', content: 'Hello, world!' }],
        {
          temperature: 0.9,
          top_p: 0.8,
          top_k: 40,
          reasoning_effort: 5,
        }
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        content: 'This is a test response with custom params',
      });
    });

    it('should handle valid completion request', async () => {
      // Mock the LLM service response
      vi.mocked(mockLLMService.completion).mockResolvedValue(
        'This is a test response from OpenAI'
      );

      const mockReq = {
        body: { input: 'Hello, world!' },
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockLLMService.completion).toHaveBeenCalledWith(
        [{ role: 'user', content: 'Hello, world!' }],
        undefined
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        content: 'This is a test response from OpenAI',
      });
    });

    it('should handle LLM service errors', async () => {
      // Mock the LLM service to throw an error
      vi.mocked(mockLLMService.completion).mockRejectedValue(
        new Error('OpenAI API error')
      );

      const mockReq = {
        body: { input: 'Hello, world!' },
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'OpenAI API error',
      });
    });

    it('should handle invalid request body', async () => {
      const mockReq = {
        body: {}, // Missing required 'input' field
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid request body',
        })
      );
    });

    it('should handle empty input', async () => {
      const mockReq = {
        body: { input: '' },
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
