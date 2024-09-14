import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Toolbar, useMediaQuery } from "@mui/material";

import { useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authActions";

import Navbar from "../components/Navbar";
import MuiDrawer from "../components/MuiDrawer";

const ProtectedLayout = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isNoneMobile = useMediaQuery("(min-width: 900px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerToggle = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/", { replace: true });
      if (!isNoneMobile && openDrawer) {
        setOpenDrawer(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        isNoneMobile={isNoneMobile}
      />
      <MuiDrawer
        open={openDrawer}
        handleDrawerToggle={handleDrawerToggle}
        isNoneMobile={isNoneMobile}
        handleLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "100%",
          maxWidth: "xl",
          margin: "0 auto",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

ProtectedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedLayout;
