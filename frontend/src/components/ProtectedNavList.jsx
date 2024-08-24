import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RecognitionsIcon from "@mui/icons-material/VolunteerActivism";
import PersonIcon from "@mui/icons-material/Person";
import AwardIcon from "@mui/icons-material/EmojiEvents";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";

import { useSelector } from "react-redux";

const ProtectedNavList = ({ handleDrawerToggle, handleLogout }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const selected = useLocation().pathname.split("/")[1];

  const navItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "admin",
      role: "admin",
    },
    { title: "Home", icon: <HomeIcon />, path: "/" },
    {
      title: "Profile",
      icon: <PersonIcon />,
      path: `profile/${currentUser?._id}`,
    },
    { title: "Recognitions", icon: <RecognitionsIcon />, path: "recognitions" },
    { title: "Nominations", icon: <PostAddIcon />, path: "nominations" },
    { title: "Winners", icon: <AwardIcon />, path: "winners" },
  ];

  return (
    <List
      disablePadding
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        flex: 1,
        px: 1,
        "& .MuiListItemButton-root": {
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          py: 0.5,
          mb: 1,
          flexGrow: 0,
          "&.Mui-selected, &.Mui-selected:hover": {
            bgcolor: (theme) => theme.palette.action.selected,
          },
        },
        "& .MuiListItemText-primary": {
          fontWeight: 500,
          fontSize: "12px",
        },
        "& .MuiListItemIcon-root": {
          color: "text.primary",
          minWidth: "35px",
        },
        "& .MuiSvgIcon-root": {
          fontSize: "20px",
        },
      }}
    >
      {navItems.map(
        (item) =>
          (item?.role ? currentUser?.role === item.role : true) && (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle(false)}
              selected={
                selected === item.path || selected === item.path.split("/")[0]
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          )
      )}
      <Divider sx={{ mb: 2 }} />
      <ListItemButton onClick={handleLogout} sx={{ mt: "auto" }}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProtectedNavList.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default ProtectedNavList;
