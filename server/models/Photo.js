const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Photo owner (userId) is required'],
    },
    fileName: {
      type: String,
      required: [true, 'Stored image file name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Photo title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    aiTags: {
      type: [String],
      default: [],
    },
    aiCaption: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

photoSchema.index({ dateTime: -1 });
photoSchema.index({ userId: 1 });

module.exports = mongoose.model('Photo', photoSchema);
