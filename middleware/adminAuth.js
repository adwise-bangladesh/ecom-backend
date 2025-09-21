const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { rateLimit } = require('./auth');

// Admin authentication middleware with enhanced security
exports.adminAuth = [
  rateLimit(15 * 60 * 1000, 50), // 50 requests per 15 minutes for admin routes
  async (req, res, next) => {
    try {
      let token;
      
      // Extract token from Authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        });
      }

      // Validate token format
      if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format.',
          code: 'INVALID_TOKEN_FORMAT'
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Validate token payload
        if (!decoded.id || !decoded.iat || !decoded.exp) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token payload.',
            code: 'INVALID_TOKEN_PAYLOAD'
          });
        }

        // Check token expiration
        if (decoded.exp < Date.now() / 1000) {
          return res.status(401).json({
            success: false,
            message: 'Token has expired.',
            code: 'TOKEN_EXPIRED'
          });
        }

        const user = await User.findById(decoded.id).select('-password').lean();
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Access denied. User not found.',
            code: 'USER_NOT_FOUND'
          });
        }

        // Check if user is active
        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Account is deactivated.',
            code: 'ACCOUNT_DEACTIVATED'
          });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.',
            code: 'ADMIN_REQUIRED',
            userRole: user.role
          });
        }

        // Additional admin-specific checks
        if (user.lastLoginAt && (Date.now() - new Date(user.lastLoginAt).getTime()) > 30 * 24 * 60 * 60 * 1000) {
          // Optional: Force re-authentication for admins who haven't logged in for 30 days
          return res.status(401).json({
            success: false,
            message: 'Admin session expired. Please log in again.',
            code: 'ADMIN_SESSION_EXPIRED'
          });
        }

        req.user = user;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token has expired.',
            code: 'TOKEN_EXPIRED'
          });
        } else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            message: 'Invalid token.',
            code: 'INVALID_TOKEN'
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Token verification failed.',
            code: 'TOKEN_VERIFICATION_FAILED'
          });
        }
      }
    } catch (error) {
      console.error('Admin authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in authentication',
        code: 'AUTH_SERVER_ERROR'
      });
    }
  }
];
