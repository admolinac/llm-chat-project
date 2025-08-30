# LLM Parameters API

The completion endpoint now supports optional LLM parameters compatible with OpenAI SDK:

## API Endpoint

`POST /api/completion`

## Request Body

```json
{
  "input": "Your prompt here",
  "params": {
    "temperature": 0.9,
    "top_p": 0.8,
    "top_k": 40,
    "reasoning_effort": 5
  }
}
```

## Parameters

- `temperature` (optional): Controls randomness (0-2, default: 0.7)
- `top_p` (optional): Controls nucleus sampling (0-1)
- `top_k` (optional): Controls top-k sampling (integer >= 1)
- `reasoning_effort` (optional): Controls reasoning effort for compatible models (1-10)

## Examples

### Basic request
```json
{
  "input": "Explain quantum computing"
}
```

### Request with custom parameters
```json
{
  "input": "Write a creative story",
  "params": {
    "temperature": 1.2,
    "top_p": 0.9
  }
}
```

### Request with reasoning parameters
```json
{
  "input": "Solve this complex math problem: ...",
  "params": {
    "temperature": 0.1,
    "reasoning_effort": 8
  }
}
```

## Notes

- All parameters are optional
- `top_k` and `reasoning_effort` are logged but may not be supported by all LLM providers
- OpenAI SDK compatible parameters: `temperature`, `top_p`
- Parameters are validated according to their acceptable ranges
