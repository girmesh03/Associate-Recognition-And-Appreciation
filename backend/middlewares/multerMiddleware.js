import multer from "multer";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import CustomError from "../utils/CustomError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use multer memoryStorage to store the files temporarily in memory
const storage = multer.memoryStorage();

// File filter to allow only certain file types, images, and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov|avi/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new CustomError("Only images and videos are allowed!", 400));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 200 }, // 200 MB limit
  fileFilter: fileFilter,
});

// Utility function to process the image using sharp
const processImageFile = async (file, index) => {
  try {
    // Create the image folder if it doesn't exist
    const imageFolder = path.join(__dirname, "../public/uploads/images");
    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder, { recursive: true });
    }

    // Initialize the filename and output path
    const filename = `${file.fieldname}-${Date.now()}-${index}.webp`;
    const outputPath = path.join(imageFolder, filename);

    // Create a sharp instance for processing the image
    const sharpInstance = sharp(file.buffer);

    // Get metadata to handle file resizing properly
    const { width, height } = await sharpInstance.metadata();

    // Calculate the resize parameters to maintain aspect ratio
    const resizedWidth = 320; // Desired width for smaller size
    const resizedHeight = Math.round((height / width) * resizedWidth); // Preserve aspect ratio

    // Process and save the image
    await sharpInstance
      .resize({
        width: resizedWidth, // Resizing width, height is auto-calculated
        fit: sharp.fit.inside, // Keep the image inside the specified dimensions
        withoutEnlargement: true, // Prevent upscaling
      })
      .webp({ quality: 80 }) // WebP format with 80% quality
      .toFile(outputPath); // Ensure it fully completes

    return {
      filename,
      path: `${process.env.BASE_URL}/uploads/images/${filename}`,
      mimetype: file.mimetype,
      size: file.size, // You may want to update this after processing
      fileType: "image",
      width: resizedWidth, // Actual width after resizing
      height: resizedHeight, // Calculated height for aspect ratio
      thumbnail: undefined, // Add a thumbnail path here if needed
    };
  } catch (err) {
    console.error("Error in processing images:", err);
    throw new CustomError("Error in processing images", 500);
  }
};

// Utility function to process the video without FFmpeg for saving
const processVideoFile = async (file, index) => {
  try {
    // Ensure the folder exists
    const videoFolder = path.join(__dirname, "../public/uploads/videos");
    if (!fs.existsSync(videoFolder)) {
      fs.mkdirSync(videoFolder, { recursive: true });
    }

    const thumbnailFolder = path.join(
      __dirname,
      "../public/uploads/thumbnails"
    );
    if (!fs.existsSync(thumbnailFolder)) {
      fs.mkdirSync(thumbnailFolder, { recursive: true });
    }

    const videoFilename = `${file.fieldname}-${Date.now()}-${index}.mp4`;
    const videoOutputPath = path.join(videoFolder, videoFilename);

    const thumbnailFilename = `${file.fieldname}-${Date.now()}-${index}.webp`;

    // Save the video buffer directly to the file system
    fs.writeFileSync(videoOutputPath, file.buffer);

    // Generate thumbnail using FFmpeg from the saved video file
    await new Promise((resolve, reject) => {
      ffmpeg(videoOutputPath) // Use the saved video file as the input for thumbnail generation
        .thumbnail({
          count: 1,
          folder: thumbnailFolder,
          filename: thumbnailFilename, // Use the filename only
        })
        .on("end", resolve)
        .on("error", reject);
    });

    return {
      filename: videoFilename,
      path: `${process.env.BASE_URL}/uploads/videos/${videoFilename}`,
      mimetype: file.mimetype,
      size: file.size,
      fileType: "video",
      width: 1280,
      height: 720,
      thumbnail: `${process.env.BASE_URL}/uploads/thumbnails/${thumbnailFilename}`, // Correct path for thumbnail
    };
  } catch (err) {
    console.error("Error in processing video:", err);
    throw new CustomError("Error in processing video", 500);
  }
};

// Middleware to process all files (both images and videos)
const processFiles = async (req, res, next) => {
  if (!req.files || !req.files.attachments) {
    return next(); // No attachments to process
  }

  const attachments = req.files.attachments;

  try {
    const uploadedFiles = await Promise.all(
      attachments.map(async (file, index) => {
        if (file.mimetype.startsWith("image/")) {
          return await processImageFile(file, index);
        } else if (file.mimetype.startsWith("video/")) {
          return await processVideoFile(file, index);
        }
      })
    );

    // console.log("processFiles: uploadedFiles", uploadedFiles);
    req.files.attachments = uploadedFiles.filter(Boolean); // Filter out undefined values
    next();
  } catch (err) {
    console.error("Error processing files:", err);
    return next(new CustomError("Error in processing files", 500));
  }
};

export { upload, processFiles };
