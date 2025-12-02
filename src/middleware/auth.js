import jwt from 'jsonwebtoken';

/**
 * Authenticate JWT token and return user payload
 * @param {string} token - JWT token
 * @returns {object|null} User object or null if invalid
 */
export const authenticateToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

/**
 * Generate JWT token for user
 * @param {object} payload - User data to encode
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
