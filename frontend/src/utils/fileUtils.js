import { toast } from "react-toastify";
import {
  MAX_ATTACHMENT_COUNT,
  MAX_FILE_COUNT,
  MAX_ATTACHMENT_TOTAL_SIZE,
  MAX_FILE_TOTAL_SIZE,
} from "./constants";

// utils getFileInfo
export const getFileInfo = async (midea) => {
  try {
    if (midea.fileType === "image") {
      return await loadImage(midea);
    } else if (midea.fileType === "video") {
      const thumbnail = await getVideoThumbnail(midea);
      return {
        ...midea,
        width: 1280,
        height: 720,
        thumbnail: thumbnail,
      };
    }
  } catch (error) {
    console.error(`Error loading attachment: ${error.message}`);
    toast.error("Error loading attachment");
    return null; // Return null for failed loads to filter out later
  }
};

// utils loadImage
const loadImage = (midea) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = midea.path;

    img.onload = () => {
      resolve({
        ...midea,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  });
};

// utils getVideoThumbnail
const getVideoThumbnail = (midea) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = midea.path;

    video.addEventListener("loadeddata", () => {
      if (video.duration === 0) {
        toast.error("Invalid video duration.");
        return reject(new Error("Invalid video duration."));
      }
      video.currentTime = 1; // Seek to 1 second for the thumbnail
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      resolve(canvas.toDataURL("image/webp")); // Return the thumbnail
    });

    video.addEventListener("error", (e) => {
      toast.error("Error extracting thumbnail.");
      reject(new Error("Error extracting thumbnail: " + e.message));
    });
  });
};

export const handleFileErrors = (fileRejections, name) => {
  const errorMessages = new Set();

  fileRejections.forEach(({ file, errors }) => {
    errors.forEach((error) => {
      if (error.code === "file-too-large") {
        errorMessages.add(
          `The File is too large. Maximum size allowed is ${
            name === "attachments"
              ? MAX_ATTACHMENT_TOTAL_SIZE
              : MAX_FILE_TOTAL_SIZE
          } MB.`
        );
      } else if (error.code === "file-invalid-type") {
        errorMessages.add(`Invalid file type: ${file.type}`);
      } else if (error.code === "too-many-files") {
        errorMessages.add(
          `You can only upload up to ${
            name === "attachments" ? MAX_ATTACHMENT_COUNT : MAX_FILE_COUNT
          } files.`
        );
      }
    });
  });

  errorMessages.forEach((message) => {
    toast.error(message, {
      autoClose: false,
      closeOnClick: true,
      draggable: true,
    });
  });
};
