// react imports
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

// mui imports
import { Paper, Typography, Button, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

// components
import ReactMideaAlbum from "../ReactMideaAlbum";

// utils and constants
import { getFileInfo, handleFileErrors } from "../../utils/fileUtils";
import {
  MAX_ATTACHMENT_TOTAL_SIZE,
  MAX_ATTACHMENT_COUNT,
  MAX_FILE_TOTAL_SIZE,
  MAX_FILE_COUNT,
} from "../../utils/constants";

const FileUploader = ({ name, control }) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue: [] });

  const allowedFileTypes =
    name === "attachments"
      ? {
          "image/*": [".jpeg", ".jpg", ".png"],
          "video/*": [".mp4", ".mov", ".avi"],
        }
      : {
          "image/*": [".jpeg", ".jpg", ".png"],
        };

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      handleFileErrors(fileRejections, name);
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const fileType = file.type.startsWith("image") ? "image" : "video";
          const fileObj = {
            filename: file.name,
            mimetype: file.type,
            fileType,
            path: preview,
            file,
          };

          return await getFileInfo(fileObj);
        })
      );
      onChange([...value, ...newFiles.filter(Boolean)]); // Filter out nulls
    },
    [onChange, value, name]
  );

  const removeAllFiles = () => {
    value.forEach((midea) => URL.revokeObjectURL(midea.path));
    onChange([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes,
    maxFiles: name === "attachments" ? MAX_ATTACHMENT_COUNT : MAX_FILE_COUNT,
    maxSize:
      name === "attachments" ? MAX_ATTACHMENT_TOTAL_SIZE : MAX_FILE_TOTAL_SIZE,
  });

  return (
    <>
      {value.length === 0 ? (
        <Paper
          {...getRootProps()}
          variant="outlined"
          sx={(theme) => ({
            padding: 4,
            textAlign: "center",
            backgroundColor: "transparent",
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            ...(isDragActive && {
              backgroundColor: theme.palette.action.hover,
              border: `1px solid ${theme.palette.primary.main}`,
            }),
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              cursor: "pointer",
            },
          })}
        >
          <input {...getInputProps()} aria-label="File upload" />
          <CloudUploadIcon
            fontSize="large"
            color={isDragActive ? "primary" : "action"}
          />
          <Typography variant="caption">
            {isDragActive
              ? "Drop the files here..."
              : "Drag and drop a maximum of 5 files here, or click to browse. (jpeg, jpg, png, gif, mp4, mov, avi)"}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            disabled={
              value.length >= MAX_FILE_COUNT ||
              value.length >= MAX_ATTACHMENT_COUNT
            }
          >
            {isDragActive ? "Drop files here" : "Browse Files"}
          </Button>
        </Paper>
      ) : (
        <>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 1,
              transform: "translate(50%, -50%)",
              backgroundColor: "grey.100",
            }}
            onClick={removeAllFiles}
          >
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>

          <ReactMideaAlbum attachments={value || []} />
        </>
      )}
    </>
  );
};

FileUploader.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};

export default React.memo(FileUploader);
