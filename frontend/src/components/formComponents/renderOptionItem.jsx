import { createElement } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";

const renderOptionItem = (name) => (props, option) => {
  switch (name) {
    case "position":
    case "department":
      return (
        <ListItem {...props} key={option.id}>
          <ListItemIcon>{createElement(option.icon)}</ListItemIcon>
          <ListItemText primary={option.value} />
        </ListItem>
      );
    case "receiver":
      return (
        <ListItemButton {...props} key={option._id}>
          <ListItemAvatar>
            {option?.profilePicture ? (
              <Avatar src={option.profilePicture} alt="" />
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={`${option.firstName} ${option.lastName}`}
            secondary={option.position}
          />
        </ListItemButton>
      );
    default:
      return null;
  }
};

export default renderOptionItem;
