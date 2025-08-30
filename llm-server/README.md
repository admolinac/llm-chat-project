# LLM Server

Simple LLM completion server with clean architecture patterns and OpenAI integration.

## Features

- Express.js server with TypeScript
- Clean architecture with base service patterns
- OpenAI SDK integration for completions
- Zod validation for environment variables and request bodies
- Winston logging
- Health check endpoints with LLM service monitoring
- Test coverage with Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key and project ID

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# OpenAI Configuration (REQUIRED)
SERVER_OPENAI_API_KEY=your-openai-api-key
SERVER_OPENAI_PROJECT_ID=your-openai-project-id
SERVER_OPENAI_MODEL=gpt-3.5-turbo
SERVER_OPENAI_BASE_URL=https://api.openai.com/v1
SERVER_OPENAI_TIMEOUT=60000
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

### API Endpoints

- `GET /health` - Health check (includes LLM service status)
- `GET /status` - Service status
- `POST /api/completion` - Text completion using OpenAI

#### Completion Request

```bash
curl -X POST http://localhost:3000/api/completion \
  -H "Content-Type: application/json" \
  -d '{"input": "What is artificial intelligence?"}'
```

Response:
```json
{
  "content": "Artificial intelligence (AI) is a branch of computer science that focuses on building smart machines capable of performing tasks that typically require human intelligence..."
}
```

### Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## Architecture

This project follows clean architecture principles:

- **Services**: Base service pattern with `LLMBaseService` abstract class
- **Implementation**: `OpenAIService` concrete implementation
- **Controllers**: Handle HTTP requests/responses with dependency injection
- **Types**: Zod schemas for validation and type inference
- **Config**: Environment variable validation and app configuration
- **Utils**: Shared utilities like logging

### Service Pattern

The `LLMBaseService` abstract class defines the contract for LLM services:

```typescript
abstract class LLMBaseService<TClient, TConfig> {
  abstract completion(messages: Array<ChatMessage>): Promise<string>;
  abstract healthCheck(): boolean;
  abstract getModels(): Promise<Array<string>>;
}
```

The `OpenAIService` implements this contract using the OpenAI SDK:

```typescript
class OpenAIService extends LLMBaseService<OpenAI, OpenAIConfig> {
  // Implementation using OpenAI SDK
}
```

## Branches

- `1/server`: Basic server skeleton
- `2/openai-sdk`: OpenAI integration with base service pattern (current)
