// react imports
import PropTypes from "prop-types";

// mui imports
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  CircularProgress,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

// redux imports
import { useSelector } from "react-redux";

const PostCommentList = ({ comments, loading, deleteComment }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  return (
    <List
      disablePadding
      sx={(theme) => ({
        maxHeight: 500,
        overflow: "auto",
        "&::-webkit-scrollbar": { width: "0.4em" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#5c5b5b" : "#999898",
          borderRadius: "4px",
        },
      })}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100px" }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        comments?.map(
          ({
            _id,
            user: { _id: userId, firstName, lastName, profilePicture },
            comment,
          }) => (
            <ListItem
              key={_id}
              sx={{
                "&.MuiListItem-root": {
                  "& .MuiListItemText-root": {
                    backgroundColor: "action.hover",
                    borderRadius: 3,
                    padding: "0.5rem 1rem",
                    margin: 0,
                    width: "auto",
                    flexGrow: 0,
                  },
                  "& .MuiTypography-root": {
                    wordWrap: "break-word",
                    overflowWrap: "anywhere",
                    width: "fit-content",
                  },
                },
              }}
            >
              <ListItemAvatar sx={{ alignSelf: "flex-start" }}>
                <Avatar src={profilePicture} alt={`${firstName} ${lastName}`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="text.secondary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/profile/${userId}`)}
                  >
                    {`${firstName} ${lastName.charAt(0).toUpperCase()}.`}
                  </Typography>
                }
                secondary={comment}
              />
              <ListItemSecondaryAction
                onClick={() => deleteComment(_id)}
                sx={{
                  display: userId === currentUser?._id ? "flex" : "none",
                  "&:hover": {
                    cursor: "pointer",
                    color: "error.main",
                  },
                }}
              >
                <DeleteIcon />
              </ListItemSecondaryAction>
            </ListItem>
          )
        )
      )}
    </List>
  );
};

PostCommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

export default PostCommentList;
