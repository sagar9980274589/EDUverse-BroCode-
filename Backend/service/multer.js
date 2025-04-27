import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp'; // Import sharp
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
    cloud_name: process.env.API_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: function (req, file, cb) {
    // Accept images, videos, PDFs, and common document formats
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-powerpoint' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      file.mimetype === 'text/plain'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

const optimizeImage = async (filePath) => {
    try {
        // Check if the file is an image by trying to get its metadata
        try {
            const metadata = await sharp(filePath).metadata();

            // If we get here, it's an image that sharp can process
            const optimizedPath = filePath + '-optimized.webp';

            await sharp(filePath)
                .resize(1080, 1080, { fit: 'inside' }) // Resize to max 1080x1080
                .webp({ quality: 80 }) // Convert to WebP with 80% quality
                .toFile(optimizedPath);

            return optimizedPath;
        } catch (sharpError) {
            // Not an image or not processable by sharp, return the original path
            console.log("File is not an image or cannot be processed by sharp, using original file");
            return filePath;
        }
    } catch (err) {
        console.error('Error processing file:', err);
        // Return original file path if optimization fails
        return filePath;
    }
};

const uploadToCloudinary = async (filePath) => {
    try {
        console.log("Uploading file to Cloudinary:", filePath);

        // Process the file (optimize if it's an image)
        const processedPath = await optimizeImage(filePath);

        // Check if the file exists
        if (!fs.existsSync(processedPath)) {
            console.error("File does not exist:", processedPath);
            throw new Error(`File does not exist: ${processedPath}`);
        }

        // Get file stats
        const stats = fs.statSync(processedPath);
        console.log("File size:", stats.size, "bytes");

        // Upload to Cloudinary with resource type auto to handle different file types
        const result = await cloudinary.uploader.upload(processedPath, {
            resource_type: "auto",
            folder: 'eduverse'
        });

        console.log("Cloudinary upload result:", result);

        // Clean up files
        try {
            // Delete original file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete processed file if it's different from the original
            if (processedPath !== filePath && fs.existsSync(processedPath)) {
                fs.unlinkSync(processedPath);
            }
        } catch (cleanupError) {
            console.error("Error cleaning up files:", cleanupError);
            // Don't throw here, we still want to return the URL
        }

        return result.secure_url;
    } catch (error) {
        console.error("Error in uploadToCloudinary:", error);
        throw error;
    }
};

export { upload, uploadToCloudinary };
