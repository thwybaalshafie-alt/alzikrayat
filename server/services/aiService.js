const fs = require('fs');
const path = require('path');

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

function getAiConfig() {
  const apiKey = process.env.ZAI_API_KEY;
  const baseUrl = (process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4').replace(/\/+$/, '');
  const model = process.env.ZAI_MODEL || 'glm-4.6v-flash';

  if (!apiKey) {
    const err = new Error('Z.AI API key is not configured in server/.env');
    err.statusCode = 503;
    throw err;
  }

  return { apiKey, baseUrl, model };
}

// Call Z.AI chat completions with retry on temporary 429/503 responses
async function callZaiChat(messages, maxTokens = 1024) {
  const { apiKey, baseUrl, model } = getAiConfig();
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: maxTokens,
        thinking: { type: 'disabled' },
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const message = data?.choices?.[0]?.message;
      const content = message?.content || message?.reasoning_content;
      if (!content) {
        const err = new Error('Z.AI API returned an empty response');
        err.statusCode = 502;
        throw err;
      }
      return typeof content === 'string' ? content.trim() : JSON.stringify(content);
    }

    const errorBody = await response.text().catch(() => '');
    const isTransient = response.status === 429 || response.status === 503;

    if (isTransient && attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      continue;
    }

    const err = new Error(
      isTransient
        ? 'Z.AI GLM-4.6V-Flash is temporarily busy. Please try again in a few seconds.'
        : `Z.AI API error (${response.status}): ${errorBody || response.statusText}`
    );
    err.statusCode = isTransient ? 503 : 502;
    throw err;
  }

  const err = new Error('Failed to reach Z.AI API');
  err.statusCode = 502;
  throw err;
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
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const promptText = [
    'Analyze this photo for a photo-sharing gallery app named Alzikrayat.',
    title ? `User title: "${title}".` : '',
    description ? `User description: "${description}".` : '',
    'Respond ONLY with valid JSON in this exact format (no markdown, no extra text):',
    '{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "caption": "A concise 1-2 sentence visual description of the image."}',
    'Keep each tag short (1-2 lowercase words, no # symbol, 4 to 6 tags total).',
  ]
    .filter(Boolean)
    .join(' ');

  const raw = await callZaiChat(
    [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: promptText },
        ],
      },
    ],
    1024
  );

  const parsed = parseJsonResponse(raw);
  if (parsed && Array.isArray(parsed.tags)) {
    const cleanTags = parsed.tags
      .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6);

    return {
      tags: cleanTags,
      caption: typeof parsed.caption === 'string' ? parsed.caption.trim() : '',
    };
  }

  return {
    tags: ['memory', 'gallery', 'featured'],
    caption: raw.slice(0, 280),
  };
}

async function suggestPhotoMetadata(buffer, mimeType = 'image/jpeg') {
  const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const promptText = [
    'Look at this image and suggest metadata for a photo-sharing web app called Alzikrayat.',
    'Respond ONLY with valid JSON in this exact format (no markdown, no extra text):',
    '{"title": "Short evocative title (3-6 words)", "description": "Warm 1-2 sentence caption describing the moment.", "tags": ["tag1", "tag2", "tag3", "tag4"]}',
  ].join(' ');

  const raw = await callZaiChat(
    [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: promptText },
        ],
      },
    ],
    1024
  );

  const parsed = parseJsonResponse(raw);
  if (parsed) {
    return {
      title: typeof parsed.title === 'string' ? parsed.title.trim().slice(0, 120) : 'Captured Memory',
      description: typeof parsed.description === 'string' ? parsed.description.trim().slice(0, 500) : '',
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t) => String(t).replace(/^#/, '').trim().toLowerCase()).filter(Boolean).slice(0, 6)
        : [],
    };
  }

  return {
    title: 'Captured Memory',
    description: raw.slice(0, 240),
    tags: ['memory', 'photo'],
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
    `You are an assistant for the Alzikrayat photo-sharing community.`,
    `Summarize the community comments on the photo titled "${photoTitle}".`,
    `Write 2-3 clear, natural sentences capturing the overall sentiment and key highlights. Do not invent facts.`,
    `\nComments:\n${formattedComments}`,
  ].join('\n');

  const summary = await callZaiChat(
    [
      {
        role: 'user',
        content: prompt,
      },
    ],
    800
  );

  return summary;
}

module.exports = {
  analyzePhotoFile,
  suggestPhotoMetadata,
  summarizeComments,
};
