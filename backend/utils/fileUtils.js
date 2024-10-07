import fs from "fs/promises"; // Use promise-based file system functions
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file deletions or errors
const logFilePath = path.join(__dirname, "../logs/deletion.log");

const logToFile = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  try {
    await fs.appendFile(logFilePath, logMessage);
  } catch (err) {
    console.error(`Failed to write to log file: ${err.message}`);
  }
};

// Retry file deletion if it's locked or busy
const attemptDelete = async (filePath, retryCount = 3, delay = 500) => {
  try {
    await fs.access(filePath);
    try {
      await fs.unlink(filePath);
      const successMessage = `Deleted file: ${filePath}`;
      // console.log(successMessage);
      await logToFile(successMessage); // Log success
    } catch (err) {
      if (err.code === "EBUSY" && retryCount > 0) {
        // console.log(`File busy, retrying deletion in ${delay}ms...`);
        setTimeout(() => attemptDelete(filePath, retryCount - 1, delay), delay);
      } else {
        const errorMessage = `Failed to delete file: ${filePath}. Error: ${err.message}`;
        // console.error(errorMessage);
        await logToFile(errorMessage); // Log error
      }
    }
  } catch (err) {
    const errorMessage = `File not found: ${filePath}. Error: ${err.message}`;
    // console.error(errorMessage);
    await logToFile(errorMessage); // Log error
  }
};

export const deleteAttachments = async (attachments) => {
  if (attachments && attachments.length > 0) {
    for (const attachment of attachments) {
      // Initialize an array to hold paths for deletion
      const pathsToDelete = [];

      // Check if there is a thumbnail and get its path
      if (attachment.thumbnail) {
        const thumbnailPath = path.join(
          __dirname,
          "../public",
          attachment.thumbnail.replace(`${process.env.BASE_URL}/`, "")
        );
        pathsToDelete.push(thumbnailPath);
        // console.log("Resolved thumbnailPath", thumbnailPath);
      }

      // Get the path for the main video or image
      const mainFilePath = path.join(
        __dirname,
        "../public",
        attachment.path.replace(`${process.env.BASE_URL}/`, "")
      );
      pathsToDelete.push(mainFilePath);
      // console.log("Resolved mainFilePath", mainFilePath);

      // Attempt to delete all paths collected
      for (const filePath of pathsToDelete) {
        await attemptDelete(filePath);
      }
    }
  }
};
