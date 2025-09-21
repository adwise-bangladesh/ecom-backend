const Media = require('../models/Media');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads with memory storage (better for production)
const storage = multer.memoryStorage(); // Store in memory instead of disk

// Alternative: Keep disk storage but with better organization
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/media');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Allow videos
  else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  }
  // Allow documents
  else if (file.mimetype === 'application/pdf' ||
           file.mimetype.includes('word') ||
           file.mimetype.includes('excel') ||
           file.mimetype.includes('powerpoint') ||
           file.mimetype.includes('text/')) {
    cb(null, true);
  }
  else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage: diskStorage, // Use disk storage for now, but memory storage is better for cloud
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Helper function to determine file category
const getFileCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
};

// Helper function to generate file URL
const generateFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/media/${filename}`;
};

// @desc    Get all media files with filtering, sorting, and pagination
// @route   GET /api/v1/admin/media
// @access  Private/Admin
const getMediaFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      search,
      tags
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const mediaFiles = await Media.find(query)
      .populate('uploadedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        mediaFiles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media files',
      error: error.message
    });
  }
};

// @desc    Upload media files
// @route   POST /api/v1/admin/media/upload
// @access  Private/Admin
const uploadMediaFiles = async (req, res) => {
  try {
    const uploadMiddleware = upload.array('files', 10); // Allow up to 10 files
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Upload error',
          error: err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        const mediaData = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: generateFileUrl(req, file.filename),
          category: getFileCategory(file.mimetype),
          uploadedBy: req.user.id,
          tags: [],
          isActive: true
        };

        // Add additional metadata based on file type
        if (file.mimetype.startsWith('image/')) {
          // For images, you could add image dimension detection here
          mediaData.alt = file.originalname;
        }

        const mediaFile = await Media.create(mediaData);
        await mediaFile.populate('uploadedBy', 'name email');
        uploadedFiles.push(mediaFile);
      }

      res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        data: {
          files: uploadedFiles
        }
      });
    });
  } catch (error) {
    console.error('Error uploading media files:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading media files',
      error: error.message
    });
  }
};

// @desc    Get single media file
// @route   GET /api/v1/admin/media/:id
// @access  Private/Admin
const getMediaFile = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaFile = await Media.findById(id)
      .populate('uploadedBy', 'name email');

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        message: 'Media file not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mediaFile
      }
    });
  } catch (error) {
    console.error('Error fetching media file:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media file',
      error: error.message
    });
  }
};

// @desc    Update media file
// @route   PUT /api/v1/admin/media/:id
// @access  Private/Admin
const updateMediaFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags, alt, description } = req.body;

    const mediaFile = await Media.findByIdAndUpdate(
      id,
      {
        tags: tags || [],
        alt: alt || '',
        description: description || ''
      },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        message: 'Media file not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Media file updated successfully',
      data: {
        mediaFile
      }
    });
  } catch (error) {
    console.error('Error updating media file:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating media file',
      error: error.message
    });
  }
};

// @desc    Delete media file
// @route   DELETE /api/v1/admin/media/:id
// @access  Private/Admin
const deleteMediaFile = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaFile = await Media.findById(id);

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        message: 'Media file not found'
      });
    }

    // Delete physical file
    const filePath = path.join('uploads/media', mediaFile.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Media file deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting media file',
      error: error.message
    });
  }
};

// @desc    Get media statistics
// @route   GET /api/v1/admin/media/stats
// @access  Private/Admin
const getMediaStats = async (req, res) => {
  try {
    const stats = await Media.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ]);

    const totalFiles = await Media.countDocuments({ isActive: true });
    const totalSize = await Media.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);

    const monthlyUploads = await Media.countDocuments({
      isActive: true,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        totalSize: totalSize[0]?.totalSize || 0,
        monthlyUploads,
        categoryStats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media stats',
      error: error.message
    });
  }
};

module.exports = {
  getMediaFiles,
  uploadMediaFiles,
  getMediaFile,
  updateMediaFile,
  deleteMediaFile,
  getMediaStats
};
