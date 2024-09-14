import React from "react";
import PropTypes from "prop-types";

import { Stack, IconButton, Typography } from "@mui/material";

import LikeIcon from "@mui/icons-material/ThumbUpRounded";
import CommentIcon from "@mui/icons-material/CommentRounded";

import { useSelector } from "react-redux";

const RecognitionActions = ({
  recognition,
  handleLike,
  setOpenComment,
  openComment,
}) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <Stack
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{ p: 1 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ px: 1, cursor: "pointer" }}
        onClick={() => handleLike(recognition._id)}
      >
        <IconButton
          color={
            recognition?.likes?.includes(currentUser?._id)
              ? "error"
              : "text.primary"
          }
        >
          <LikeIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {recognition?.likes?.length === 0
            ? "Like"
            : recognition?.likes?.length === 1 &&
              recognition?.likes?.includes(currentUser?._id)
            ? "You"
            : `${recognition?.likes?.length} Likes`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ px: 1, cursor: "pointer" }}
        onClick={() => setOpenComment(!openComment)}
      >
        <IconButton>
          <CommentIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {recognition?.comments?.length === 0
            ? "Comment"
            : recognition?.comments?.length === 1
            ? "1 Comment"
            : `${recognition?.comments?.length} Comments`}
        </Typography>
      </Stack>
    </Stack>
  );
};

RecognitionActions.propTypes = {
  recognition: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  setOpenComment: PropTypes.func.isRequired,
  openComment: PropTypes.bool.isRequired,
};

export default React.memo(RecognitionActions);
