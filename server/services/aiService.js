const fs = require('fs');
const path = require('path');

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';

  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured in server/.env');
    err.statusCode = 503;
    throw err;
  }

  return { apiKey, primaryModel, fallbackModel };
}

// Call Google AI Studio Gemini API with per-model timeout and automatic fallback
async function callGemini(parts, { jsonMode = false, temperature = 0.4 } = {}) {
  const { apiKey, primaryModel, fallbackModel } = getGeminiConfig();
  const modelsToTry = primaryModel === fallbackModel
    ? [primaryModel]
    : [primaryModel, fallbackModel];

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    };

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (fetchErr) {
      lastError = new Error(`Gemini AI (${model}) timed out. Please try again.`);
      lastError.statusCode = 504;
      continue;
    }

    if (response.ok) {
      const data = await response.json();
      const text = (data?.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || '')
        .join('')
        .trim();

      if (!text) {
        lastError = new Error(`Gemini (${model}) returned an empty response`);
        lastError.statusCode = 502;
        continue;
      }

      return { text, modelUsed: model };
    }

    const errorBody = await response.text().catch(() => '');
    const retryable = response.status === 429 || response.status === 503 || response.status === 404;

    lastError = new Error(
      response.status === 429 || response.status === 503
        ? `Gemini AI (${model}) is temporarily busy. Please try again in a moment.`
        : `Gemini API error (${response.status}): ${errorBody || response.statusText}`
    );
    lastError.statusCode = response.status === 429 || response.status === 503 ? 503 : 502;

    if (!retryable) {
      throw lastError;
    }
  }

  throw lastError || new Error('Failed to reach Gemini API');
}

function parseJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  }
}

async function analyzePhotoFile(filePath, title = '', description = '') {
  if (!fs.existsSync(filePath)) {
    const err = new Error('Image file not found on disk');
    err.statusCode = 404;
    throw err;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_BY_EXT[ext] || 'image/jpeg';
  const base64 = fs.readFileSync(filePath).toString('base64');

  const promptText = [
    'Look carefully at this image for a photo-sharing gallery app named Alzikrayat.',
    title ? `User title: "${title}".` : '',
    description ? `User description: "${description}".` : '',
    'Return ONLY a valid JSON object with exact keys:',
    '{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "caption": "An accurate 1-2 sentence visual description of what is actually shown in the image."}',
    'Keep each tag short (1-2 lowercase words, no # symbol, 4 to 6 accurate tags based on the visual content).',
  ]
    .filter(Boolean)
    .join(' ');

  const { text, modelUsed } = await callGemini(
    [
      { inline_data: { mime_type: mimeType, data: base64 } },
      { text: promptText },
    ],
    { jsonMode: true, temperature: 0.35 }
  );

  const parsed = parseJsonResponse(text);
  if (parsed && Array.isArray(parsed.tags)) {
    const cleanTags = parsed.tags
      .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6);

    return {
      tags: cleanTags,
      caption: typeof parsed.caption === 'string' ? parsed.caption.trim() : '',
      modelUsed,
    };
  }

  return {
    tags: ['photo', 'gallery'],
    caption: text.slice(0, 280),
    modelUsed,
  };
}

async function suggestPhotoMetadata(buffer, mimeType = 'image/jpeg') {
  const base64 = buffer.toString('base64');

  const promptText = [
    'Inspect this image carefully and suggest accurate metadata for uploading it to a photo-sharing app called Alzikrayat.',
    'Describe ONLY what is visibly present in the image.',
    'Return ONLY a valid JSON object with exact keys:',
    '{"title": "Short accurate title (3-6 words)", "description": "Accurate 1-2 sentence caption describing what is in the photo.", "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}',
    'Keep each tag short (1-2 lowercase words, no # symbol).',
  ].join(' ');

  const { text, modelUsed } = await callGemini(
    [
      { inline_data: { mime_type: mimeType, data: base64 } },
      { text: promptText },
    ],
    { jsonMode: true, temperature: 0.35 }
  );

  const parsed = parseJsonResponse(text);
  if (parsed) {
    return {
      title: typeof parsed.title === 'string' ? parsed.title.trim().slice(0, 120) : 'Captured Memory',
      description: typeof parsed.description === 'string' ? parsed.description.trim().slice(0, 500) : '',
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t) => String(t).replace(/^#/, '').trim().toLowerCase()).filter(Boolean).slice(0, 6)
        : [],
      modelUsed,
    };
  }

  return {
    title: 'Captured Memory',
    description: text.slice(0, 240),
    tags: ['photo', 'memory'],
    modelUsed,
  };
}

async function summarizeComments(photoTitle, comments) {
  const formattedComments = comments
    .map((c, idx) => {
      const author = c.userId
        ? `${c.userId.firstName || ''} ${c.userId.lastName || ''}`.trim()
        : 'User';
      return `${idx + 1}. ${author}: "${c.comment}"`;
    })
    .join('\n');

  const prompt = [
    'You are an assistant for the Alzikrayat photo-sharing community.',
    `Summarize the community comments on the photo titled "${photoTitle}".`,
    'Write 2-3 clear, natural sentences capturing the overall sentiment and key highlights. Do not invent facts.',
    `\nComments:\n${formattedComments}`,
  ].join('\n');

  const { text, modelUsed } = await callGemini([{ text: prompt }], {
    jsonMode: false,
    temperature: 0.4,
  });

  return {
    summary: text,
    modelUsed,
  };
}

module.exports = {
  analyzePhotoFile,
  suggestPhotoMetadata,
  summarizeComments,
};
