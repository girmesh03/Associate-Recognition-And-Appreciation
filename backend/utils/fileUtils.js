import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, "../logs/deletion.log"); // Log file path

export const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error(`Failed to write to log file: ${err.message}`);
    }
  });
};

export const deleteAttachments = (attachments) => {
  if (attachments && attachments.length > 0) {
    attachments.forEach((attachment) => {
      const filePath = path.join(
        __dirname,
        "../public",
        attachment.path.replace(`${process.env.BASE_URL}/`, "")
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          const errorMessage = `Failed to delete file: ${filePath}. Error: ${err.message}`;
          // console.error(errorMessage);
          logToFile(errorMessage); // Log the error
        } else {
          const successMessage = `Deleted file: ${filePath}`;
          // console.log(successMessage);
          logToFile(successMessage); // Log the success
        }
      });
    });
  }
};
