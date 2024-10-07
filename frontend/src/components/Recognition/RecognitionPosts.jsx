// react imports
import { useEffect, useState, useCallback } from "react";
import { useAsyncValue, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

// mui imports
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import GobackIcon from "@mui/icons-material/FirstPageOutlined";

// redux imports
import { useSelector } from "react-redux";

// api imports
import { makeRequest } from "../../api/apiRequest";

// components imports
import RecognitionMenu from "./RecognitionMenu";
import RecognitionContent from "./RecognitionContent";
import ReactMideaAlbum from "../ReactMideaAlbum";
import PostActions from "../PostActions";

const RecognitionPosts = () => {
  const { data } = useAsyncValue();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [recognitions, setRecognitions] = useState(data);
  const navigate = useNavigate();

  // State for action menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedRecognition, setSelectedRecognition] = useState(null);

  const handleMenuClick = useCallback((event, recognition) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecognition(recognition);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRecognition(null);
  }, []);

  const updateRecognitions = (recognitionId, updatedRecognition) => {
    setRecognitions((prev) =>
      prev.map((recognition) =>
        recognitionId === recognition._id ? updatedRecognition : recognition
      )
    );
  };

  const handleBookmarkToggle = useCallback(
    async (recognitionId) => {
      try {
        const response = await makeRequest.put(
          `/recognitions/${recognitionId}/bookmark`
        );
        updateRecognitions(recognitionId, response.data);
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
    [currentUser._id, handleMenuClose]
  );

  const handleDeleteRecognition = useCallback(
    async (recognitionId) => {
      try {
        await makeRequest.delete(`/recognitions/${recognitionId}`);
        setRecognitions((prev) =>
          prev.filter((recognition) => recognition._id !== recognitionId)
        );
        toast.success("Recognition successfully deleted!");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        handleMenuClose();
      }
    },
    [handleMenuClose]
  );

  const handleLike = useCallback(async (recognitionId) => {
    try {
      const response = await makeRequest.put(
        `/recognitions/${recognitionId}/like`
      );
      updateRecognitions(recognitionId, response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => setRecognitions(data), [data]);

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: { xs: 0.5, sm: 2 },
        py: 2,
      }}
    >
      {recognitions.length === 0 ? (
        <Box
          width={{ xs: "100%", sm: "80%" }}
          height="70vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          margin="0 auto"
          gap={4}
          p={2}
        >
          <Typography variant="subtitle1" align="center">
            No recognitions found.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            gap={2}
          >
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<GobackIcon />}
              onClick={() => navigate("/recognitions/create")}
            >
              Create Recognition
            </Button>
          </Stack>
        </Box>
      ) : (
        recognitions.map((recognition) => (
          <Card
            variant="outlined"
            key={recognition?._id}
            sx={{ overflow: "visible", p: { xs: 0, sm: 1 } }}
          >
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
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    ":hover": { color: "secondary.main" },
                  }}
                  onClick={() =>
                    navigate(`/profile/${recognition?.receiver?._id}`)
                  }
                >
                  {`${
                    recognition.receiver.firstName
                  } ${recognition.receiver.lastName.charAt(0).toUpperCase()}.`}
                </Typography>
              }
              subheader={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" component="span">
                    {`${recognition?.category} |`}
                  </Typography>
                  <Tooltip title={moment(recognition?.createdAt).format("LLL")}>
                    <Typography variant="caption" component="span" sx={{}}>
                      {moment(recognition?.createdAt).fromNow()}
                    </Typography>
                  </Tooltip>
                </Stack>
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

            {selectedRecognition?._id === recognition._id && (
              <RecognitionMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                handleClose={handleMenuClose}
                recognition={selectedRecognition}
                BookmarkToggle={handleBookmarkToggle}
                DeleteRecognition={handleDeleteRecognition}
              />
            )}

            <RecognitionContent recognition={recognition} />
            {recognition?.attachments?.length > 0 && (
              <ReactMideaAlbum attachments={recognition?.attachments} />
            )}
            <PostActions
              post={recognition}
              postType="recognition"
              handleLike={handleLike}
            />
          </Card>
        ))
      )}
    </Box>
  );
};

export default RecognitionPosts;
