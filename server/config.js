/**
 * AI Brain Configuration
 * ضع مفاتيح API الخاصة بك هنا
 */

export const config = {
  // OpenAI GPT
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY',
    models: {
      'gpt-4o': 'GPT-4o',
      'gpt-4o-mini': 'GPT-4o Mini',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    },
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },

  // Anthropic Claude
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY',
    models: {
      'claude-sonnet-4-20250514': 'Claude Sonnet 4',
      'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
      'claude-3-opus-20240229': 'Claude 3 Opus',
      'claude-3-haiku-20240307': 'Claude 3 Haiku',
    },
    endpoint: 'https://api.anthropic.com/v1/messages'
  },

  // Google Gemini
  google: {
    apiKey: process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY',
    models: {
      'gemini-2.0-flash': 'Gemini 2.0 Flash',
      'gemini-1.5-pro': 'Gemini 1.5 Pro',
      'gemini-1.5-flash': 'Gemini 1.5 Flash',
    },
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/'
  },

  // DeepSeek
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_API_KEY',
    models: {
      'deepseek-chat': 'DeepSeek Chat',
      'deepseek-reasoner': 'DeepSeek Reasoner',
    },
    endpoint: 'https://api.deepseek.com/v1/chat/completions'
  },

  // Groq (Fast inference)
  groq: {
    apiKey: process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY',
    models: {
      'llama-3.3-70b-versatile': 'Llama 3.3 70B',
      'mixtral-8x7b-32768': 'Mixtral 8x7B',
    },
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },

  server: {
    port: process.env.PORT || 3001
  }
};

