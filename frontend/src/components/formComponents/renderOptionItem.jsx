// react imports
import { createElement } from "react";

// mui imports
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const renderOptionItem = (name) => (props, option) => {
  switch (name) {
    case "position":
    case "department":
    case "category":
      return (
        <ListItem {...props} key={option._id} disablePadding>
          <ListItemIcon>{createElement(option.icon)}</ListItemIcon>
          <ListItemText primary={option.label} />
        </ListItem>
      );
    case "receiver":
    case "users":
      return (
        <ListItem {...props} key={option._id} disablePadding>
          <ListItemAvatar>
            <Avatar src={option.profilePicture} alt={option.firstName} />
          </ListItemAvatar>
          <ListItemText
            primary={`${option.firstName} ${option.lastName}`}
            secondary={option.position}
          />
        </ListItem>
      );
    default:
      return null;
  }
};

export default renderOptionItem;
