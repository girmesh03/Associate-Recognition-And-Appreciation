import PropTypes from "prop-types";
import {
  alpha,
  Avatar,
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";

import { useSelector } from "react-redux";

import ProtectedNavList from "./ProtectedNavList";
import { drawerWidth } from "../utils/constants";
import avatar from "../assets/images/noAvatar.jpg";

const MuiDrawer = ({
  open,
  handleDrawerToggle,
  isNoneMobile,
  handleLogout,
}) => {
  const { currentUser, mode } = useSelector((state) => state.auth);

  return (
    <Drawer
      open={open}
      onClose={handleDrawerToggle(false)}
      variant={isNoneMobile ? "permanent" : "temporary"}
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: "100dvh",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          boxShadow: "none",
          backgroundColor: "background.paper",
          position: { xs: "absolute", sm: "relative" },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage:
            mode === "light"
              ? "linear-gradient(180deg, #CEE5FD, #FBFCFE)"
              : `linear-gradient(#02294F, ${alpha("#131B20", 0.0)})`,
          backgroundSize: "100% 40%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ py: 1, flexGrow: 0 }}
          >
            {/* TODO: drawer lags when open due to the avatar used */}
            <Avatar src={avatar} sx={{ width: 50, height: 50 }} />
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {`${currentUser?.firstName} ${currentUser?.lastName}`}
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ flexGrow: 1 }}>
            <ProtectedNavList
              handleDrawerToggle={handleDrawerToggle}
              handleLogout={handleLogout}
            />
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

MuiDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  isNoneMobile: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default MuiDrawer;
