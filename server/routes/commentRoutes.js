const express = require('express');
const commentController = require('../controllers/commentController');
const {
  validateBody,
  validateObjectId,
  createCommentSchema,
} = require('../middleware/validation');

const router = express.Router();

// Mounted at /api/photos so routes resolve to /api/photos/:id/comments
router.get('/:id/comments', validateObjectId('id'), commentController.getByPhoto);
router.post(
  '/:id/comments',
  validateObjectId('id'),
  validateBody(createCommentSchema),
  commentController.create
);

module.exports = router;
