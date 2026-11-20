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
  const visionModel = process.env.ZAI_MODEL || 'glm-4.6v-flash';
  const textModel = process.env.ZAI_TEXT_MODEL || 'glm-4.5-flash';

  if (!apiKey) {
    const err = new Error('Z.AI API key is not configured in server/.env');
    err.statusCode = 503;
    throw err;
  }

  return { apiKey, baseUrl, visionModel, textModel };
}

// Call Z.AI chat completions with short retry on temporary 429/503 responses
async function callZaiChat(messages, { model, maxTokens = 1024, maxAttempts = 2 } = {}) {
  const { apiKey, baseUrl, textModel } = getAiConfig();
  const targetModel = model || textModel;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
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
      return {
        text: typeof content === 'string' ? content.trim() : JSON.stringify(content),
        modelUsed: data?.model || targetModel,
      };
    }

    const errorBody = await response.text().catch(() => '');
    const isTransient = response.status === 429 || response.status === 503;

    if (isTransient && attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      continue;
    }

    const err = new Error(
      isTransient
        ? `Z.AI (${targetModel}) is temporarily overloaded.`
        : `Z.AI API error (${response.status}): ${errorBody || response.statusText}`
    );
    err.statusCode = isTransient ? 503 : 502;
    err.isOverloaded = isTransient;
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

function formatReadableFileName(fileName = '') {
  const base = path.basename(fileName, path.extname(fileName));
  return base
    .replace(/^photo_[a-z0-9._-]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function analyzePhotoFile(filePath, title = '', description = '') {
  if (!fs.existsSync(filePath)) {
    const err = new Error('Image file not found on disk');
    err.statusCode = 404;
    throw err;
  }

  const { visionModel, textModel } = getAiConfig();
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

  let result;
  try {
    result = await callZaiChat(
      [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            { type: 'text', text: promptText },
          ],
        },
      ],
      { model: visionModel, maxTokens: 1024, maxAttempts: 2 }
    );
  } catch (err) {
    if (!err.isOverloaded) throw err;
    // Fallback to Z.AI text model when the free vision pool is overloaded (429/1305)
    const fallbackPrompt = [
      'Generate gallery tags and a refined 1-2 sentence photo caption for a photo in the Alzikrayat photo-sharing app.',
      title ? `Title: "${title}".` : '',
      description ? `Description: "${description}".` : '',
      `Image file name: "${path.basename(filePath)}".`,
      'Respond ONLY with valid JSON in this exact format (no markdown, no extra text):',
      '{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "caption": "A concise 1-2 sentence description."}',
      'Keep each tag short (1-2 lowercase words, no # symbol, 4 to 6 tags total).',
    ]
      .filter(Boolean)
      .join(' ');

    result = await callZaiChat([{ role: 'user', content: fallbackPrompt }], {
      model: textModel,
      maxTokens: 600,
      maxAttempts: 2,
    });
  }

  const parsed = parseJsonResponse(result.text);
  if (parsed && Array.isArray(parsed.tags)) {
    const cleanTags = parsed.tags
      .map((t) => String(t).replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6);

    return {
      tags: cleanTags,
      caption: typeof parsed.caption === 'string' ? parsed.caption.trim() : '',
      modelUsed: result.modelUsed,
    };
  }

  return {
    tags: ['memory', 'gallery', 'featured'],
    caption: result.text.slice(0, 280),
    modelUsed: result.modelUsed,
  };
}

async function suggestPhotoMetadata(buffer, mimeType = 'image/jpeg', originalName = '') {
  const { visionModel, textModel } = getAiConfig();
  const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const promptText = [
    'Look at this image and suggest metadata for a photo-sharing web app called Alzikrayat.',
    'Respond ONLY with valid JSON in this exact format (no markdown, no extra text):',
    '{"title": "Short evocative title (3-6 words)", "description": "Warm 1-2 sentence caption describing the moment.", "tags": ["tag1", "tag2", "tag3", "tag4"]}',
  ].join(' ');

  let result;
  try {
    result = await callZaiChat(
      [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            { type: 'text', text: promptText },
          ],
        },
      ],
      { model: visionModel, maxTokens: 1024, maxAttempts: 2 }
    );
  } catch (err) {
    if (!err.isOverloaded) throw err;
    const readableName = formatReadableFileName(originalName);
    const fallbackPrompt = [
      'Suggest a creative photo title, warm 1-2 sentence caption, and 4 short lowercase tags for a new photo upload on the Alzikrayat photo-sharing app.',
      readableName
        ? `The user selected a file named "${readableName}" (${mimeType}).`
        : `The user selected a ${mimeType} photo to share as a memory.`,
      'Respond ONLY with valid JSON in this exact format (no markdown, no extra text):',
      '{"title": "Short evocative title (3-6 words)", "description": "Warm 1-2 sentence caption.", "tags": ["tag1", "tag2", "tag3", "tag4"]}',
    ].join(' ');

    result = await callZaiChat([{ role: 'user', content: fallbackPrompt }], {
      model: textModel,
      maxTokens: 500,
      maxAttempts: 2,
    });
  }

  const parsed = parseJsonResponse(result.text);
  if (parsed) {
    return {
      title: typeof parsed.title === 'string' ? parsed.title.trim().slice(0, 120) : 'Captured Memory',
      description: typeof parsed.description === 'string' ? parsed.description.trim().slice(0, 500) : '',
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t) => String(t).replace(/^#/, '').trim().toLowerCase()).filter(Boolean).slice(0, 6)
        : [],
      modelUsed: result.modelUsed,
    };
  }

  return {
    title: 'Captured Memory',
    description: result.text.slice(0, 240),
    tags: ['memory', 'photo'],
    modelUsed: result.modelUsed,
  };
}

async function summarizeComments(photoTitle, comments) {
  const { textModel } = getAiConfig();

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

  const result = await callZaiChat([{ role: 'user', content: prompt }], {
    model: textModel,
    maxTokens: 600,
    maxAttempts: 2,
  });

  return {
    summary: result.text,
    modelUsed: result.modelUsed,
  };
}

module.exports = {
  analyzePhotoFile,
  suggestPhotoMetadata,
  summarizeComments,
};
