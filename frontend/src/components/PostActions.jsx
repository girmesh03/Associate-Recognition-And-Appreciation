// react imports
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// mui imports
import { Stack, IconButton, Typography, Avatar, Box } from "@mui/material";
import LikeIcon from "@mui/icons-material/ThumbUpRounded";
import CommentIcon from "@mui/icons-material/CommentRounded";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

// redux imports
import { useSelector } from "react-redux";

// api imports
import { makeRequest } from "../api/apiRequest";

// component imports
import CommentField from "./formComponents/CommentField";
import PostCommentList from "./PostCommentList";
import EmojiSelector from "./EmojiSelector";

const PostActions = ({ post, postType, handleLike }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [comments, setComments] = useState([]);
  const [openComments, setOpenComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { handleSubmit, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      userComment: "",
    },
  });

  const fetchComments = async (postId, postType) => {
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
  };

  const handleAddComment = async ({ userComment }) => {
    const userInput = userComment.trim(); // Clean the comment input
    if (userInput) {
      try {
        const { data } = await makeRequest.post("/comments", {
          comment: userInput,
          postType,
          postId: post._id,
        });
        setComments((prev) => [...prev, data]);
        reset();
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

  const handleOpenComments = useCallback(() => {
    setOpenComments((prev) => !prev);
    if (!openComments) {
      fetchComments(post._id, postType);
    }
    setShowEmojiPicker(false);
  }, [post._id, postType, openComments]);

  return (
    <Stack direction="column" sx={{ pb: 1.5 }}>
      {/* action area for like and comment */}
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ py: 0.5 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
          onClick={() => handleLike(post._id)}
        >
          <IconButton
            color={
              post?.likes?.includes(currentUser?._id) ? "error" : "text.primary"
            }
          >
            <LikeIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post?.likes?.length === 0
              ? "Like"
              : post?.likes?.length === 1 &&
                post?.likes?.includes(currentUser?._id)
              ? "You"
              : `${post?.likes?.length} Likes`}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
          onClick={handleOpenComments}
        >
          <IconButton>
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post?.comments?.length === 0
              ? "Comment"
              : post?.comments?.length === 1
              ? "1 Comment"
              : `${post?.comments?.length} Comments`}
          </Typography>
        </Stack>
      </Stack>

      {/* comment list */}
      {openComments && (
        <Stack
          direction="column"
          spacing={1}
          sx={{ position: "relative", borderTop: 1, borderColor: "divider" }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              pt: 0.5,
              pl: 2,
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Comments
          </Typography>
          <PostCommentList
            comments={comments}
            loading={loading}
            deleteComment={handleDeleteComment}
          />

          <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
            <Avatar
              component={Link}
              to={`/profile/${currentUser?._id}`}
              src={currentUser?.profilePicture}
              sx={{ alignSelf: "flex-start", cursor: "pointer" }}
              alt={`${currentUser?.firstName}`}
            />
            <Box
              component="form"
              onSubmit={handleSubmit(handleAddComment)}
              noValidate
              sx={{
                flexGrow: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CommentField name="userComment" control={control} />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                sx={{
                  flexGrow: 1,
                  alignSelf: "flex-end",
                  mr: { xs: 1, sm: 2 },
                }}
              >
                {/* Emoji Selector and Send Button */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="end"
                  spacing={1}
                >
                  <IconButton
                    size="small"
                    sx={{ color: "text.secondary" }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <InsertEmoticonIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    type="submit"
                    sx={{ color: "primary.main" }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {showEmojiPicker && (
            <EmojiSelector
              name="userComment"
              getValues={getValues}
              setValue={setValue}
              setShowEmojiPicker={setShowEmojiPicker}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

PostActions.propTypes = {
  post: PropTypes.object.isRequired,
  postType: PropTypes.string.isRequired,
  handleLike: PropTypes.func.isRequired,
};

export default PostActions;
