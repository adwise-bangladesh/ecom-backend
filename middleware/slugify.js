const slugify = require('slugify');

// Slugify middleware for products and categories
exports.slugify = (fieldName) => {
  return (req, res, next) => {
    if (req.body[fieldName]) {
      req.body.slug = slugify(req.body[fieldName], {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }
    next();
  };
};
