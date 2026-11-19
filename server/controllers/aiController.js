const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { uploadsDir } = require('../middleware/upload');
const {
  analyzePhotoFile,
  suggestPhotoMetadata,
  summarizeComments,
} = require('../services/aiService');

/**
 * POST /api/ai/photos/:id/analyze
 * Uses Z.AI GLM-4.6V-Flash to auto-tag and generate a visual caption for an uploaded photo,
 * persisting the result on the Photo document in MongoDB.
 */
async function analyzePhoto(req, res, next) {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    const filePath = path.join(uploadsDir, photo.fileName);
    const { tags, caption } = await analyzePhotoFile(filePath, photo.title, photo.description);

    photo.aiTags = tags;
    photo.aiCaption = caption;
    await photo.save();

    return res.status(200).json({
      message: 'AI photo analysis completed',
      model: process.env.ZAI_MODEL || 'glm-4.6v-flash',
      aiTags: photo.aiTags,
      aiCaption: photo.aiCaption,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/ai/photos/:id/summarize-comments
 * Summarizes all comments on a photo using Z.AI GLM-4.6V-Flash.
 */
async function summarizePhotoComments(req, res, next) {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id).lean();

    if (!photo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    const comments = await Comment.find({ photoId: id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 })
      .lean();

    if (comments.length === 0) {
      return res.status(400).json({
        error: 'No Comments',
        message: 'There are no comments to summarize yet',
      });
    }

    const summary = await summarizeComments(photo.title, comments);

    return res.status(200).json({
      message: 'Comments summarized successfully',
      model: process.env.ZAI_MODEL || 'glm-4.6v-flash',
      commentCount: comments.length,
      summary,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/ai/suggest-metadata
 * Accepts an in-memory image preview and returns AI-suggested title, description, and tags.
 */
async function suggestMetadata(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please attach an image file to analyze',
      });
    }

    const suggestion = await suggestPhotoMetadata(req.file.buffer, req.file.mimetype);

    return res.status(200).json({
      message: 'Metadata suggestion generated',
      model: process.env.ZAI_MODEL || 'glm-4.6v-flash',
      ...suggestion,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  analyzePhoto,
  summarizePhotoComments,
  suggestMetadata,
};
