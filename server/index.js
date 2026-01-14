/**
 * AI Brain - Node.js Backend Server
 * مستشار الذكاء الاصطناعي المتعدد
 */

import express from 'express';
import cors from 'cors';
import { config } from './config.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// API Handlers
// ==========================================

/**
 * إرسال طلب إلى OpenAI
 */
async function callOpenAI(prompt, model) {
  const response = await fetch(config.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openai.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'أنت مساعد ذكي ومفيد. أجب بشكل واضح ومفصل.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API Error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * إرسال طلب إلى Anthropic Claude
 */
async function callAnthropic(prompt, model) {
  const response = await fetch(config.anthropic.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropic.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 2000,
      system: 'أنت مساعد ذكي ومفيد. أجب بشكل واضح ومفصل.',
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API Error');
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * إرسال طلب إلى Google Gemini
 */
async function callGoogle(prompt, model) {
  const endpoint = `${config.google.endpoint}${model}:generateContent?key=${config.google.apiKey}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7
      },
      systemInstruction: {
        parts: [{ text: 'أنت مساعد ذكي ومفيد. أجب بشكل واضح ومفصل.' }]
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Google API Error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * إرسال طلب إلى DeepSeek
 */
async function callDeepSeek(prompt, model) {
  const response = await fetch(config.deepseek.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.deepseek.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'أنت مساعد ذكي ومفيد. أجب بشكل واضح ومفصل.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'DeepSeek API Error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * إرسال طلب إلى Groq
 */
async function callGroq(prompt, model) {
  const response = await fetch(config.groq.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.groq.apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'أنت مساعد ذكي ومفيد. أجب بشكل واضح ومفصل.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq API Error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ==========================================
// Routes
// ==========================================

/**
 * الحصول على قائمة النماذج المتاحة
 */
app.get('/api/models', (req, res) => {
  const models = [];
  
  for (const [provider, providerConfig] of Object.entries(config)) {
    if (providerConfig.models) {
      for (const [modelId, modelName] of Object.entries(providerConfig.models)) {
        models.push({
          id: `${provider}:${modelId}`,
          name: modelName,
          provider: provider.charAt(0).toUpperCase() + provider.slice(1),
          providerId: provider
        });
      }
    }
  }
  
  res.json({ success: true, models });
});

/**
 * إرسال استشارة إلى النماذج المحددة
 */
app.post('/api/chat', async (req, res) => {
  const { prompt, models: selectedModels } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'الرجاء إدخال نص' });
  }
  
  if (!selectedModels || selectedModels.length === 0) {
    return res.status(400).json({ success: false, error: 'الرجاء اختيار نموذج واحد على الأقل' });
  }
  
  const responses = await Promise.all(
    selectedModels.map(async (modelFullId) => {
      const [provider, model] = modelFullId.split(':');
      const startTime = Date.now();
      
      try {
        let response;
        
        switch (provider) {
          case 'openai':
            response = await callOpenAI(prompt, model);
            break;
          case 'anthropic':
            response = await callAnthropic(prompt, model);
            break;
          case 'google':
            response = await callGoogle(prompt, model);
            break;
          case 'deepseek':
            response = await callDeepSeek(prompt, model);
            break;
          case 'groq':
            response = await callGroq(prompt, model);
            break;
          default:
            throw new Error(`مزود غير معروف: ${provider}`);
        }
        
        const responseTime = Date.now() - startTime;
        
        return {
          modelId: modelFullId,
          modelName: config[provider]?.models[model] || model,
          provider: provider.charAt(0).toUpperCase() + provider.slice(1),
          response,
          responseTime,
          success: true
        };
      } catch (error) {
        return {
          modelId: modelFullId,
          modelName: config[provider]?.models[model] || model,
          provider: provider.charAt(0).toUpperCase() + provider.slice(1),
          error: error.message,
          success: false
        };
      }
    })
  );
  
  res.json({ success: true, responses });
});

/**
 * التحقق من حالة الخادم
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 AI Brain Server running on http://localhost:${PORT}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   GET  /api/models - List available models`);
  console.log(`   POST /api/chat   - Send consultation request`);
  console.log(`   GET  /api/health - Server health check`);
});





