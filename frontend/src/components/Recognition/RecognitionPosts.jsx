import { useCallback, useEffect, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import { toast } from "react-toastify";

import {
  Box,
  Card,
  CardHeader,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useSelector } from "react-redux";
import { makeRequest } from "../../api/apiRequest";

import RecognitionMenu from "./RecognitionMenu";
import RecognitionContent from "./RecognitionContent";
import RecognitionMedia from "./RecognitionMedia";
import RecognitionActions from "./RecognitionActions";
import PostComments from "../../components/PostComments";

const RecognitionPosts = () => {
  const { data } = useAsyncValue();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [recognitions, setRecognitions] = useState(data);
  const [openComments, setOpenComments] = useState({});
  const navigate = useNavigate();

  // State for action menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecognition, setSelectedRecognition] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuClick = useCallback((event, recognition) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecognition(recognition);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRecognition(null);
  }, []);

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(
    async (recognitionId) => {
      try {
        const response = await makeRequest.put(
          `/recognitions/${recognitionId}/bookmark`
        );
        const updatedRecognitions = recognitions.map((recognition) =>
          recognitionId === recognition._id ? response.data : recognition
        );
        setRecognitions(updatedRecognitions);
        toast.success(
          response.data.savedBy.includes(currentUser._id)
            ? "Recognition saved to bookmarks!"
            : "Recognition removed from bookmarks!"
        );
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        handleMenuClose();
      }
    },
    [currentUser, recognitions, handleMenuClose]
  );

  // Handle delete recognition
  const handleDeleteRecognition = useCallback(
    async (recognitionId) => {
      try {
        await makeRequest.delete(`/recognitions/${recognitionId}`);
        const updatedRecognitions = recognitions.filter(
          (recognition) => recognition._id !== recognitionId
        );
        setRecognitions(updatedRecognitions);
        toast.success("Recognition successfully deleted!");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        handleMenuClose();
      }
    },
    [recognitions, handleMenuClose]
  );

  // Handle recognition like
  const handleLike = useCallback(
    async (recognitionId) => {
      try {
        const response = await makeRequest.put(
          `/recognitions/${recognitionId}/like`
        );
        const updatedRecognitions = recognitions.map((recognition) =>
          recognitionId === recognition._id ? response.data : recognition
        );
        setRecognitions(updatedRecognitions);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    [recognitions]
  );

  const toggleCommentSection = useCallback((postId) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  }, []);

  useEffect(() => {
    setRecognitions(data);
  }, [data]);

  return (
    <Box
      sx={{
        py: 1,
        px: { lg: 3 },
        maxWidth: { xs: "100%", md: "75%", lg: "100%" },
        margin: "0 auto",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recognitions?.map((recognition) => (
          <Card variant="outlined" key={recognition?._id}>
            <CardHeader
              sx={{ padding: { xs: "1rem 0.75rem", sm: "1rem" } }}
              avatar={
                <Avatar
                  src={recognition?.receiver?.profilePicture}
                  alt={`${recognition?.receiver?.firstName} ${recognition?.receiver?.lastName}`}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/profile/${recognition?.receiver?._id}`)
                  }
                />
              }
              title={
                <Typography
                  variant="body2"
                  component="span"
                  onClick={() =>
                    navigate(`/profile/${recognition?.receiver?._id}`)
                  }
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    ":hover": {
                      color: "secondary.main",
                    },
                  }}
                >
                  {`${recognition?.receiver?.firstName} ${recognition?.receiver?.lastName}`}
                </Typography>
              }
              subheader={
                <Box>
                  <Typography variant="body2" component="span">
                    {recognition?.category}
                  </Typography>{" "}
                  |{" "}
                  <Tooltip
                    title={moment(recognition?.createdAt).format("LLL")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Typography variant="caption" component="span">
                      {moment(recognition?.createdAt).fromNow()}
                    </Typography>
                  </Tooltip>
                </Box>
              }
              action={
                <IconButton
                  id="recognition-more"
                  aria-controls={open ? "recognition-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => handleMenuClick(e, recognition)}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />

            {/* RecognitionMenu Component */}
            {selectedRecognition && (
              <RecognitionMenu
                anchorEl={anchorEl}
                open={open}
                handleClose={handleMenuClose}
                recognition={selectedRecognition}
                BookmarkToggle={handleBookmarkToggle}
                DeleteRecognition={handleDeleteRecognition}
              />
            )}

            <RecognitionContent recognition={recognition} />
            <RecognitionMedia attachments={recognition?.attachments} />
            <RecognitionActions
              recognition={recognition}
              handleLike={handleLike}
              openComment={!!openComments[recognition._id]}
              setOpenComment={() => toggleCommentSection(recognition._id)}
            />
            {openComments[recognition._id] && (
              <PostComments postId={recognition._id} postType="recognition" />
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default RecognitionPosts;
