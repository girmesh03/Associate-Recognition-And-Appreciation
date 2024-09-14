import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { toast } from "react-toastify";

import {
  Box,
  Avatar,
  TextField,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import { useSelector } from "react-redux";
import { makeRequest } from "../api/apiRequest";

const PostComments = ({ postId, postType }) => {
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await makeRequest.get(
        `/comments?postId=${postId}&postType=${postType}`
      );
      setComments(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [postId, postType]);

  const handleAddComment = async () => {
    if (userComment.trim()) {
      try {
        const { data } = await makeRequest.post("/comments", {
          comment: userComment,
          postType,
          postId,
        });
        setComments((prev) => [...prev, data]);
        setUserComment("");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add comment");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await makeRequest.delete(`/comments/${commentId}`);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      toast.error(
        error.response?.status === 403
          ? "You cannot delete this comment"
          : "Failed to delete comment"
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <Box
      width="100%"
      sx={{ padding: { xs: 1, sm: 2 }, borderTop: 1, borderColor: "divider" }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar
          component={Link}
          to={`/profile/${currentUser?._id}`}
          src={currentUser?.profilePicture}
          sx={{ alignSelf: "flex-start", cursor: "pointer" }}
          alt={`${currentUser?.firstName}`}
        />
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddComment();
          }}
          sx={{
            flexGrow: 1,
            pl: 2,
            borderRadius: 5,
            backgroundColor: (theme) => theme.palette.action.hover,
            display: "flex",
          }}
        >
          <TextField
            multiline
            fullWidth
            minRows={1}
            maxRows={8}
            placeholder={userComment.trim() ? "" : "Add a comment"}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                padding: 0,
                color: "text.secondary",
              },
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& fieldset": {
                  boxShadow: "none",
                  backgroundColor: "inherit",
                },
                "&.Mui-focused": {
                  outline: "none",
                },
              },
            }}
          />
          <IconButton
            disabled={!userComment.trim()}
            type="submit"
            sx={{
              alignSelf: "flex-end",
              color: userComment.trim()
                ? (theme) => theme.palette.primary.main
                : "text.secondary",
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Stack>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        comments.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {comments.map((comment) => (
              <Box key={comment._id} sx={{ display: "flex" }}>
                <Stack direction="row" spacing={1}>
                  <Avatar
                    src={comment?.user?.profilePicture}
                    alt={`${comment?.user?.firstName}`}
                    component={Link}
                    to={`/profile/${comment?.user?._id}`}
                  />
                  <Box
                    flexGrow={1}
                    sx={{
                      p: 0.5,
                      borderRadius: 5,
                      backgroundColor: (theme) => theme.palette.action.hover,
                    }}
                  >
                    <Typography
                      variant="body2"
                      component={Link}
                      to={`/profile/${comment?.user?._id}`}
                      sx={{
                        p: 2,
                        mb: 1,
                        width: "fit-content",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                        textDecoration: "none",
                        ":hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {comment?.user?.firstName}{" "}
                      {comment?.user?.lastName.charAt(0).toUpperCase()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        px: 2,
                        fontSize: "0.8rem",
                        wordWrap: "break-word",
                        overflowWrap: "anywhere",
                        color: "text.secondary",
                        boxSizing: "border-box",
                      }}
                    >
                      {comment?.comment}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton
                  sx={{
                    color: "text.secondary",
                    alignSelf: "flex-start",
                    ml: "auto",
                  }}
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )
      )}
    </Box>
  );
};

PostComments.propTypes = {
  postId: PropTypes.string.isRequired,
  postType: PropTypes.string.isRequired,
};

export default React.memo(PostComments);
