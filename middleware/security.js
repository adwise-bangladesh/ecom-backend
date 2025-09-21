// Simple security headers middleware
exports.securityHeaders = (req, res, next) => {
  // Basic security headers only
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
};

// Simple rate limiting (very permissive for development)
exports.createRateLimit = (windowMs, max, message) => {
  return (req, res, next) => {
    // Skip rate limiting for now to avoid blocking requests
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

// Simple request logging middleware
exports.requestLogger = (req, res, next) => {
  // Simple logging - just pass through for now
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

// Simple request size limiting
exports.requestSizeLimit = (limit = '10mb') => {
  return (req, res, next) => {
    // Skip size limiting for now
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

// Simple security audit
exports.securityAudit = (req, res, next) => {
  // Skip security audit for now to avoid blocking requests
  next();
};
