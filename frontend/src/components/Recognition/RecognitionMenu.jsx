// react imports
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// mui imports
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// redux imports
import { useSelector } from "react-redux";

const RecognitionMenu = ({
  anchorEl,
  open,
  handleClose,
  recognition,
  BookmarkToggle,
  DeleteRecognition,
}) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isBookmarked = recognition?.savedBy?.includes(currentUser?._id);
  const canEditOrDelete =
    currentUser?._id === recognition.sender?._id ||
    currentUser?._id === recognition.receiver?._id ||
    currentUser?.role === "admin";

  return (
    <Menu
      id="recognition-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "recognition-more",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        maxWidth: 400,
        "& .MuiPaper-root": {
          width: "100%",
          boxShadow: 1,
          pt: 1,
          pb: 1,
          borderRadius: 4,
          backgroundColor: "background.paper",
          "& .MuiMenuItem-root": {
            borderRadius: 0,
          },
          "& .MuiListItemIcon-root": {
            alignSelf: "flex-start",
            minWidth: 32,
            padding: 0.75,
            marginRight: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "50%",
            "& .MuiSvgIcon-root": {
              margin: "auto",
            },
          },
        },
      }}
    >
      {/* Bookmark / Unbookmark */}
      <MenuItem onClick={() => BookmarkToggle(recognition._id)}>
        <ListItemIcon>
          {isBookmarked ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" fontWeight="bold">
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </Typography>
          }
          secondary={
            <Typography variant="body2" component="span" whiteSpace="pre-wrap">
              {isBookmarked
                ? "Remove this recognition from your saved list."
                : "Save this recognition for future reference."}
            </Typography>
          }
        />
      </MenuItem>

      {/* Edit (Only for sender, receiver, or admin) */}
      <Tooltip
        title={
          !canEditOrDelete
            ? "You do not have permission to edit this recognition."
            : ""
        }
        placement="bottom"
      >
        <span>
          <MenuItem
            disabled={!canEditOrDelete}
            component={Link}
            to={`/recognitions/${recognition._id}/edit`}
          >
            <ListItemIcon>
              <EditIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="bold">
                  Edit
                </Typography>
              }
              secondary={
                <Typography variant="body2" whiteSpace="pre-wrap">
                  Modify this recognition. Changes can be made to the details of
                  the recognition.
                </Typography>
              }
            />
          </MenuItem>
        </span>
      </Tooltip>

      <Tooltip
        title={
          !canEditOrDelete
            ? "You do not have permission to delete this recognition."
            : ""
        }
        placement="bottom"
      >
        <span>
          <MenuItem
            disabled={!canEditOrDelete}
            onClick={() => DeleteRecognition(recognition._id)}
          >
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="bold">
                  Delete
                </Typography>
              }
              secondary={
                <Typography variant="body2" whiteSpace="pre-wrap">
                  Permanently remove this recognition. This action cannot be
                  undone.
                </Typography>
              }
            />
          </MenuItem>
        </span>
      </Tooltip>
    </Menu>
  );
};

RecognitionMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  recognition: PropTypes.object,
  BookmarkToggle: PropTypes.func,
  DeleteRecognition: PropTypes.func,
};

export default React.memo(RecognitionMenu);
