import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, CardMedia, Typography } from "@mui/material";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const RecognitionMedia = ({ attachments }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const attachmentCount = attachments.length;
  const maxVisible = 3;

  // Map attachments to slides
  const slides = attachments.map((attachment) => {
    return attachment.fileType === "video"
      ? {
          type: "video",
          width: 1280,
          height: 720,
          sources: [
            {
              src: attachment.path,
              type: "video/mp4",
            },
          ],
          autoPlay: true,
        }
      : {
          type: "image",
          src: attachment.path,
          width: 800,
          height: 600,
          thumbnail: attachment.path,
        };
  });

  // Handle opening the lightbox from a specific slide
  const handleOpenLightbox = (index) => {
    setCurrentSlide(index); // Start lightbox from the clicked item
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <Box width="100%" p={0.1}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoFlow: "row dense",
          gap: 0.5,
          position: "relative",
          cursor: "pointer",
        }}
      >
        {attachments.slice(0, maxVisible).map((attachment, index) => (
          <Box
            key={attachment._id}
            sx={{
              gridRow: "span 2",
              gridColumn:
                attachmentCount === 1 ||
                (index === 0 && attachmentCount >= maxVisible)
                  ? "span 4"
                  : "span 2",
              position: "relative",

              ".play-icon": { opacity: 1 },
            }}
            onClick={() => handleOpenLightbox(index)}
          >
            <CardMedia
              component={attachment.fileType === "image" ? "img" : "video"}
              image={
                attachment.fileType === "image" ? attachment.path : undefined
              }
              src={
                attachment.fileType === "video" ? attachment.path : undefined
              }
              alt={attachment.filename}
              sx={{
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                margin: "0 auto",
                height: 200,
              }}
            />
            {attachment.fileType === "video" && (
              <Box
                className="play-icon"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  "&::before": {
                    content: '""',
                    display: "block",
                    width: 0,
                    height: 0,
                    borderTop: "12px solid transparent",
                    borderBottom: "12px solid transparent",
                    borderLeft: "20px solid #fff",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-35%, -50%)",
                  },
                }}
              />
            )}
            {attachmentCount > maxVisible && index === maxVisible - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="#fff">
                  +{attachmentCount - maxVisible}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Lightbox
        plugins={[Thumbnails, Video]}
        open={isLightboxOpen}
        close={handleCloseLightbox}
        slides={slides}
        index={currentSlide}
      />
    </Box>
  );
};

RecognitionMedia.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      fileType: PropTypes.oneOf(["image", "video"]).isRequired,
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(RecognitionMedia);
