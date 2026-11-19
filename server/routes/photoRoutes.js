const express = require('express');
const photoController = require('../controllers/photoController');
const { uploadPhotoMiddleware } = require('../middleware/upload');
const {
  validateBody,
  validateObjectId,
  createPhotoSchema,
} = require('../middleware/validation');

const router = express.Router();

router.get('/', photoController.getAll);
router.get('/stats', photoController.getStats);
router.get('/:id', validateObjectId('id'), photoController.getOne);
router.post(
  '/',
  uploadPhotoMiddleware.single('image'),
  validateBody(createPhotoSchema),
  photoController.create
);
router.delete('/:id', validateObjectId('id'), photoController.remove);

module.exports = router;
