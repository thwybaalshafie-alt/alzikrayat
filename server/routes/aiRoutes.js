const express = require('express');
const multer = require('multer');
const aiController = require('../controllers/aiController');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const err = new Error('Only image files are supported for AI analysis');
      err.code = 'INVALID_FILE_TYPE';
      cb(err, false);
    }
  },
});

router.post('/photos/:id/analyze', validateObjectId('id'), aiController.analyzePhoto);
router.post(
  '/photos/:id/summarize-comments',
  validateObjectId('id'),
  aiController.summarizePhotoComments
);
router.post('/suggest-metadata', memoryUpload.single('image'), aiController.suggestMetadata);

module.exports = router;
