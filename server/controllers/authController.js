const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Validates input (via Joi middleware), hashes password with bcrypt, and creates a new User.
 */
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      location: location || '',
      description: description || '',
      occupation: occupation || '',
    });

    // User.toJSON automatically excludes the password hash
    return res.status(201).json({
      message: 'Registration successful',
      user: newUser.toJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 * Verifies email and bcrypt password hash, returning the user's public profile on success.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
};
