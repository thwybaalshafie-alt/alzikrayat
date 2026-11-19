const Comment = require('../models/Comment');
const Photo = require('../models/Photo');
const User = require('../models/User');

// GET /api/photos/:id/comments
async function getByPhoto(req, res, next) {
  try {
    const { id } = req.params;

    const photoExists = await Photo.exists({ _id: id });
    if (!photoExists) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    const comments = await Comment.find({ photoId: id })
      .populate('userId', 'firstName lastName email occupation')
      .sort({ dateTime: 1 })
      .lean();

    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
}

// POST /api/photos/:id/comments
async function create(req, res, next) {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    const [photo, user] = await Promise.all([
      Photo.findById(id),
      User.findById(userId),
    ]);

    if (!photo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Photo not found',
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in as a valid user to post a comment',
      });
    }

    const createdComment = await Comment.create({
      photoId: photo._id,
      userId: user._id,
      comment,
    });

    const populatedComment = await Comment.findById(createdComment._id)
      .populate('userId', 'firstName lastName email occupation')
      .lean();

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getByPhoto,
  create,
};
