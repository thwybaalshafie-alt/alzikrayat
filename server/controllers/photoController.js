const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { uploadsDir } = require('../middleware/upload');
const { analyzePhotoFile } = require('../services/aiService');

/**
 * GET /api/photos
 * Returns all photos sorted newest-first, with populated owner details and comment counts.
 * Supports optional ?search= and ?tag= query parameters.
 */
async function getAll(req, res, next) {
  try {
    const { search, tag } = req.query;
    const filter = {};

    if (tag && typeof tag === 'string' && tag.trim()) {
      filter.aiTags = tag.trim().toLowerCase();
    }

    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { aiTags: regex },
      ];
    }

    const photos = await Photo.find(filter)
      .populate('userId', 'firstName lastName email location occupation')
      .sort({ dateTime: -1 })
      .lean();

    // Attach comment count per photo in a single aggregation query
    const photoIds = photos.map((p) => p._id);
    const counts = await Comment.aggregate([
      { $match: { photoId: { $in: photoIds } } },
      { $group: { _id: '$photoId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
    const enrichedPhotos = photos.map((photo) => ({
      ...photo,
      commentCount: countMap.get(photo._id.toString()) || 0,
    }));

    return res.status(200).json(enrichedPhotos);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/photos/stats
 * Returns summary platform statistics for the Home landing page.
 */
async function getStats(_req, res, next) {
  try {
    const [totalPhotos, totalUsers, totalComments] = await Promise.all([
      Photo.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
    ]);

    return res.status(200).json({
      totalPhotos,
      totalUsers,
      totalComments,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/photos/:id
 * Returns a single photo's full metadata, populated owner, and populated comments.
 */
async function getOne(req, res, next) {
  try {
    const { id } = req.params;

    const photo = await Photo.findById(id)
      .populate('userId', 'firstName lastName email location occupation description')
      .lean();

    if (!photo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    const comments = await Comment.find({ photoId: id })
      .populate('userId', 'firstName lastName email occupation')
      .sort({ dateTime: 1 })
      .lean();

    return res.status(200).json({
      ...photo,
      comments,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/photos
 * Saves an uploaded photo file to disk and persists metadata in MongoDB.
 * Optionally auto-analyzes the image using Z.AI GLM-4.6V-Flash when autoAnalyze is enabled.
 */
async function create(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please attach an image file to upload',
      });
    }

    const { userId, title, description, autoAnalyze } = req.body;

    // Verify that the submitting user exists
    const user = await User.findById(userId);
    if (!user) {
      fs.unlink(req.file.path, () => {});
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in as a valid user to upload photos',
      });
    }

    let aiTags = [];
    let aiCaption = '';

    const shouldAutoAnalyze = autoAnalyze === true || autoAnalyze === 'true';
    if (shouldAutoAnalyze && process.env.ZAI_API_KEY) {
      try {
        const analysis = await analyzePhotoFile(req.file.path, title, description);
        aiTags = analysis.tags;
        aiCaption = analysis.caption;
      } catch (aiErr) {
        // Non-fatal: upload still succeeds even if external AI service times out
        console.warn('[AI Auto-Analyze Skipped]', aiErr.message);
      }
    }

    const newPhoto = await Photo.create({
      userId: user._id,
      fileName: req.file.filename,
      title,
      description: description || '',
      aiTags,
      aiCaption,
    });

    const populatedPhoto = await Photo.findById(newPhoto._id)
      .populate('userId', 'firstName lastName email location occupation')
      .lean();

    return res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: { ...populatedPhoto, commentCount: 0 },
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    return next(err);
  }
}

/**
 * DELETE /api/photos/:id
 * Verifies server-side ownership before deleting the photo document, its comments, and the file on disk.
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const requestingUserId = req.headers['x-user-id'] || req.body?.userId || req.query?.userId;

    if (!requestingUserId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to delete a photo',
      });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    // Strictly verify ownership server-side
    if (photo.userId.toString() !== String(requestingUserId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are only allowed to delete your own uploaded photos',
      });
    }

    // Delete associated comments and photo record
    await Comment.deleteMany({ photoId: photo._id });
    await Photo.deleteOne({ _id: photo._id });

    // Remove the physical image file from server/uploads/
    const filePath = path.join(uploadsDir, photo.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.warn('[File Cleanup Warning]', unlinkErr.message);
        }
      });
    }

    return res.status(200).json({
      message: 'Photo deleted successfully',
      deletedPhotoId: id,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAll,
  getStats,
  getOne,
  create,
  remove,
};
