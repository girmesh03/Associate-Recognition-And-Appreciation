// react imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

// lightbox imports
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// mui imports
import { Box } from "@mui/material";

// utils
import { playIconStyle } from "../utils/styles";

const CustomMedia = ({ photo, width, height, onClick }) => {
  const isVideo = photo.fileType === "video";

  return (
    <Box
      width={width}
      height={height}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        boxShadow: 2,
        "&:hover": {
          ".video-icon": { opacity: 1 },
          transform: "scale(1.05)",
          transition: "transform 0.3s ease-in-out",
        },
      }}
    >
      {isVideo ? (
        <>
          <video
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          >
            <source src={photo.src} type={photo.mimeType} />
          </video>
          <Box className="video-icon" sx={{ ...playIconStyle }} />
        </>
      ) : (
        <img
          onClick={onClick}
          src={photo.src}
          alt={photo.filename}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 5,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "2px 5px",
          borderRadius: "0 8px 0 8px",
          fontSize: "0.75rem",
        }}
      >
        {isVideo ? "VIDEO" : "IMAGE"}
      </Box>
    </Box>
  );
};

CustomMedia.propTypes = {
  photo: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ReactMideaAlbum = ({ attachments }) => {
  const [photoIndex, setPhotoIndex] = useState(-1);

  // Format the attachments for use in the album
  const formattedAttachments = attachments.map((attachment) => ({
    src: attachment.path,
    width: attachment.width,
    height: attachment.height,
    fileType: attachment.fileType,
    mimeType: attachment.mimeType,
    thumbnail: attachment.thumbnail,
    filename: attachment.filename,
  }));

  const slides = attachments.map((attachment) =>
    attachment.fileType === "video"
      ? {
          type: "video",
          width: attachment.width,
          height: attachment.height,
          sources: [
            {
              src: attachment.path,
              type: attachment.mimeType || "video/mp4",
            },
          ],
          poster: attachment.thumbnail,
        }
      : {
          type: "image",
          src: attachment.path,
          width: attachment.width,
          height: attachment.height,
        }
  );

  return (
    <Box
      p={1}
      sx={{
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <ColumnsPhotoAlbum
        layout="columns"
        photos={formattedAttachments}
        spacing={5}
        columns={() => {
          if (attachments.length === 1) return 1;
          if (attachments.length <= 3) return 2;
          if (attachments.length >= 4) return 3;
        }}
        render={{
          photo: ({ props }, { photo, index, width, height }) => (
            <CustomMedia
              {...props}
              key={index}
              photo={photo}
              width={width}
              height={height}
              onClick={() => setPhotoIndex(index)}
            />
          ),
        }}
      />

      <Lightbox
        plugins={[Thumbnails, Video]}
        open={photoIndex >= 0}
        close={() => setPhotoIndex(-1)}
        slides={slides}
        index={photoIndex}
      />
    </Box>
  );
};

ReactMideaAlbum.propTypes = {
  attachments: PropTypes.array.isRequired,
};

export default React.memo(ReactMideaAlbum);
