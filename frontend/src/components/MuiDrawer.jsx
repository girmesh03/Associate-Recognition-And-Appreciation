import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Drawer,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useSelector } from "react-redux";

import ProtectedNavList from "./ProtectedNavList";
import { drawerWidth } from "../utils/constants";

const MuiDrawer = ({
  open,
  handleDrawerToggle,
  isNoneMobile,
  handleLogout,
}) => {
  const { currentUser, mode } = useSelector((state) => state.auth);

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        open={open}
        onClose={handleDrawerToggle(false)}
        variant={isNoneMobile ? "permanent" : "temporary"}
        anchor="left"
        ModalProps={{
          keepMounted: !isNoneMobile,
        }}
        sx={{
          display: { xs: "block", md: "block" },
          height: "100%",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "none",
            bgcolor: "background.paper",
            backgroundImage:
              mode === "light"
                ? "linear-gradient(180deg, #CEE5FD, #FBFCFE)"
                : `linear-gradient(#02294F, ${alpha("#131B20", 0.0)})`,
            backgroundSize: "100% 40%",
            backgroundRepeat: "no-repeat",
            position: { md: "relative" },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}
          >
            {open || isNoneMobile ? (
              <Avatar
                src={currentUser?.profilePicture}
                sx={{ width: 50, height: 50 }}
              />
            ) : (
              <Skeleton variant="circular" width={50} height={50} />
            )}
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {`${currentUser?.firstName} ${currentUser?.lastName}`}
            </Typography>
          </Stack>
          <Box flexGrow={1}>
            <ProtectedNavList
              handleDrawerToggle={handleDrawerToggle}
              handleLogout={handleLogout}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

MuiDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  isNoneMobile: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default MuiDrawer;
