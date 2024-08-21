import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";

import Navbar from "../components/Navbar";
import MuiDrawer from "../components/MuiDrawer";

const ProtectedLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isNoneMobile = useMediaQuery("(min-width: 900px)");

  const handleDrawerToggle = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleLogout = () => {
    console.log("logout", openDrawer);
    if (!isNoneMobile) setOpenDrawer(false);
  };

  return (
    <Box
      width="100%"
      height="100%"
      sx={{ display: isNoneMobile ? "flex" : "block" }}
    >
      <MuiDrawer
        open={openDrawer}
        handleDrawerToggle={handleDrawerToggle}
        isNoneMobile={isNoneMobile}
        handleLogout={handleLogout}
      />

      <Box width="100%" height="100%" sx={{ flexGrow: 1 }}>
        <Navbar
          isNoneMobile={isNoneMobile}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
