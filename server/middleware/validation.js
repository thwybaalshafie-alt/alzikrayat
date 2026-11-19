const Joi = require('joi');
const mongoose = require('mongoose');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  location: Joi.string().trim().max(100).allow('').optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
  occupation: Joi.string().trim().max(100).allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const createPhotoSchema = Joi.object({
  userId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.empty': 'User must be logged in to upload photos',
    'string.pattern.base': 'Invalid userId format',
  }),
  title: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Photo title is required',
    'string.min': 'Title must be at least 2 characters',
  }),
  description: Joi.string().trim().max(1000).allow('').optional(),
  autoAnalyze: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false')).optional(),
});

const createCommentSchema = Joi.object({
  userId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.empty': 'User must be logged in to comment',
    'string.pattern.base': 'Invalid userId format',
  }),
  comment: Joi.string().trim().min(1).max(1000).required().messages({
    'string.empty': 'Comment text cannot be empty',
  }),
});

/**
 * Reusable Joi validation middleware factory.
 * Cleans up any uploaded file if body validation fails on multipart routes.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      if (req.file && req.file.path) {
        const fs = require('fs');
        fs.unlink(req.file.path, () => {});
      }
      const details = error.details.map((d) => d.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: details[0],
        details,
      });
    }

    req.body = value;
    return next();
  };
}

/**
 * Validates that a route parameter (default: :id) is a valid MongoDB ObjectId.
 */
function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid identifier',
        message: `Invalid ${paramName} format`,
      });
    }
    return next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  createPhotoSchema,
  createCommentSchema,
  validateBody,
  validateObjectId,
};
