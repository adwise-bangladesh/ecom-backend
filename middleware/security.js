// Note: Using built-in Node.js modules for Railway compatibility
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// Security headers middleware (built-in implementation)
exports.securityHeaders = (req, res, next) => {
  // Set security headers manually
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "script-src 'self'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'; " +
    "font-src 'self'; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src 'none';"
  );
  
  // HSTS (only for HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Rate limiting for different route types (built-in implementation)
exports.createRateLimit = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId).filter(time => time > windowStart);
      requests.set(clientId, clientRequests);
    } else {
      requests.set(clientId, []);
    }

    const clientRequests = requests.get(clientId);
    
    if (clientRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    clientRequests.push(now);
    next();
  };
};

// General rate limiting
exports.generalRateLimit = exports.createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP. Please try again later.'
);

// Strict rate limiting for auth routes
exports.authRateLimit = exports.createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many authentication attempts. Please try again later.'
);

// Admin rate limiting
exports.adminRateLimit = exports.createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests per window
  'Too many admin requests. Please try again later.'
);

// Request logging middleware
exports.requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log only in development or for errors
    if (process.env.NODE_ENV === 'development' || res.statusCode >= 400) {
      console.log('Request:', logData);
    }
  });
  
  next();
};

// CORS configuration
exports.corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Request size limiting
exports.requestSizeLimit = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxSize = parseSize(limit);
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Request entity too large',
        code: 'REQUEST_TOO_LARGE',
        maxSize: limit
      });
    }
    
    next();
  };
};

// Parse size string to bytes
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return 10 * 1024 * 1024; // Default 10MB
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return value * units[unit];
}

// IP whitelist middleware (for admin routes)
exports.ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next(); // No whitelist configured
    }
    
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied. IP not whitelisted.',
        code: 'IP_NOT_WHITELISTED'
      });
    }
  };
};

// Request timeout middleware
exports.requestTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeout, () => {
      res.status(408).json({
        success: false,
        message: 'Request timeout',
        code: 'REQUEST_TIMEOUT'
      });
    });
    
    next();
  };
};

// Security audit logging
exports.securityAudit = (req, res, next) => {
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  const checkSuspicious = (obj, path = '') => {
    if (typeof obj === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(obj)) {
          console.warn(`Security Alert: Suspicious content detected in ${path}:`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url,
            method: req.method,
            suspiciousContent: obj.substring(0, 100),
            timestamp: new Date().toISOString()
          });
          break;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        checkSuspicious(obj[key], `${path}.${key}`);
      }
    }
  };
  
  checkSuspicious(req.body, 'body');
  checkSuspicious(req.query, 'query');
  checkSuspicious(req.params, 'params');
  
  next();
};
