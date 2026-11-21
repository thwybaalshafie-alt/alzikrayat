const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { uploadsDir } = require('../middleware/upload');
const {
  analyzePhotoFile,
  suggestPhotoMetadata,
  summarizeComments,
} = require('../services/aiService');

// POST /api/ai/photos/:id/analyze
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
    const { tags, caption, modelUsed } = await analyzePhotoFile(
      filePath,
      photo.title,
      photo.description
    );

    photo.aiTags = tags;
    photo.aiCaption = caption;
    await photo.save();

    return res.status(200).json({
      message: 'AI photo analysis completed',
      model: modelUsed || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      aiTags: photo.aiTags,
      aiCaption: photo.aiCaption,
    });
  } catch (err) {
    return next(err);
  }
}

// POST /api/ai/photos/:id/summarize-comments
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

    const { summary, modelUsed } = await summarizeComments(photo.title, comments);

    return res.status(200).json({
      message: 'Comments summarized successfully',
      model: modelUsed || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      commentCount: comments.length,
      summary,
    });
  } catch (err) {
    return next(err);
  }
}

// POST /api/ai/suggest-metadata
async function suggestMetadata(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please attach an image file to analyze',
      });
    }

    const { title, description, tags, modelUsed } = await suggestPhotoMetadata(
      req.file.buffer,
      req.file.mimetype
    );

    return res.status(200).json({
      message: 'Metadata suggestion generated',
      model: modelUsed || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      title,
      description,
      tags,
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
