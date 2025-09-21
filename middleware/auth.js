const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting cache (simple in-memory store for demo)
const rateLimitCache = new Map();

// Rate limiting middleware
const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (rateLimitCache.has(clientId)) {
      const requests = rateLimitCache.get(clientId).filter(time => time > windowStart);
      rateLimitCache.set(clientId, requests);
    } else {
      rateLimitCache.set(clientId, []);
    }

    const requests = rateLimitCache.get(clientId);
    
    if (requests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    requests.push(now);
    next();
  };
};

// Enhanced protect routes with rate limiting and security
exports.protect = [
  rateLimit(15 * 60 * 1000, 100), // 100 requests per 15 minutes
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
            message: 'Token is not valid. User not found.',
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
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in authentication',
        code: 'AUTH_SERVER_ERROR'
      });
    }
  }
];

// Optional authentication - extracts user if token is present but doesn't require it
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Validate token format
        if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token)) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Check token expiration
          if (decoded.exp && decoded.exp >= Date.now() / 1000) {
            const user = await User.findById(decoded.id).select('-password').lean();
            
            if (user && user.isActive) {
              req.user = user;
            }
          }
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        // Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Optional auth token error:', error.message);
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required for this action',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'User role not defined',
          code: 'ROLE_NOT_DEFINED'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`,
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredRoles: roles,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error in authorization',
        code: 'AUTH_SERVER_ERROR'
      });
    }
  };
};

// Export rate limiting for use in other middleware
exports.rateLimit = rateLimit;
