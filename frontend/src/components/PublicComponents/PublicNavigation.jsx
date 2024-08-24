import { useState } from "react";
import { Link } from "react-router-dom";
import {
  alpha,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../../redux/features/auth/authSlice";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import RecognitionsIcon from "@mui/icons-material/VolunteerActivism";
import FeaturesIcon from "@mui/icons-material/AutoAwesome";
import TestimonialsIcon from "@mui/icons-material/ThumbUp";
import HighlightsIcon from "@mui/icons-material/Star";
import PricingIcon from "@mui/icons-material/AttachMoney";
import FAQIcon from "@mui/icons-material/HelpOutline";
import LoginIcon from "@mui/icons-material/Login";
import SignInIcon from "@mui/icons-material/Fingerprint";

const publicNavListItems = [
  { title: "Features", icon: <FeaturesIcon />, name: "features" },
  { title: "Testimonials", icon: <TestimonialsIcon />, name: "testimonials" },
  { title: "Highlights", icon: <HighlightsIcon />, name: "highlights" },
  { title: "Pricing", icon: <PricingIcon />, name: "pricing" },
  { title: "FAQ", icon: <FAQIcon />, name: "faq" },
];

import { drawerWidth } from "../../utils/constants";

const PublicNavigation = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isAuthenticated, mode } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDrawerToggle = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const scrollToSection = (sectionId) => {
    console.log("sectionId", sectionId);
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpenDrawer(false);
    }

    // TODO: remove it after section id is added
    setOpenDrawer(false);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: { xs: 0, md: 2 },
        "& .MuiSvgIcon-root": {
          color: "text.primary",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 } }}>
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: { xs: 0, md: "999px" },
            bgcolor:
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(24px)",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
          })}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mr: 2 }}
            >
              <IconButton
                onClick={handleDrawerToggle(true)}
                variant="outlined"
                size="small"
                sx={{ display: { lg: "none" } }}
              >
                <MenuRoundedIcon />
              </IconButton>
              <Typography
                variant="h4"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 3,
                  fontSize: "clamp(1.5rem, 1vw, 2rem)",
                  color: "text.primary",
                  textDecoration: "none",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Monthmaster
              </Typography>
            </Stack>
            <Box sx={{ display: { xs: "none", lg: "flex" } }}>
              {isAuthenticated && (
                <MenuItem
                  component={Link}
                  to="/recognitions"
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Recognitions
                  </Typography>
                </MenuItem>
              )}

              {publicNavListItems.map((item) => (
                <MenuItem
                  key={item.title}
                  onClick={() => scrollToSection(item.name)}
                >
                  <Typography variant="body2" color="text.primary">
                    {item.title}
                  </Typography>
                </MenuItem>
              ))}
            </Box>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => dispatch(toggleMode())}>
              {mode === "light" ? (
                <DarkModeIcon sx={{ fontSize: "20px" }} />
              ) : (
                <LightModeIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                color="primary"
                variant="text"
                size="small"
                component={Link}
                to="/login"
              >
                Sign in
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                component={Link}
                to="/signup"
              >
                Sign up
              </Button>
            </Box>
          </Stack>

          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <Drawer
              open={openDrawer}
              onClose={handleDrawerToggle(false)}
              anchor="left"
            >
              <Box
                sx={{
                  minWidth: `${drawerWidth}px`,
                  backgroundColor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  backgroundImage:
                    mode === "light"
                      ? "linear-gradient(180deg, #CEE5FD, #FBFCFE)"
                      : `linear-gradient(#02294F, ${alpha("#131B20", 0.0)})`,
                  backgroundSize: "100% 40%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Typography
                  variant="h5"
                  textAlign="center"
                  component={Link}
                  to="/"
                  onClick={handleDrawerToggle(false)}
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: "text.primary",
                    textDecoration: "none",
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  Monthmaster
                </Typography>
                <Stack direction="column" flexGrow={1}>
                  <List
                    disablePadding
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      overflowY: "auto",
                      px: 1,
                      mt: 2,
                      "& .MuiListItemButton-root": {
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: "divider",
                        py: 0.5,
                        mb: 1,
                        flexGrow: 0,
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
                    {isAuthenticated && (
                      <ListItemButton component={Link} to="/recognitions">
                        <ListItemIcon>
                          <RecognitionsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Recognitions" />
                      </ListItemButton>
                    )}
                    {publicNavListItems.map((item) => (
                      <ListItemButton
                        key={item.name}
                        onClick={() => scrollToSection(item.name)}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <ListItemButton
                      component={Link}
                      to="/login"
                      onClick={handleDrawerToggle(false)}
                      sx={{ mt: "auto" }}
                    >
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary="Login" />
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      to="/signup"
                      onClick={handleDrawerToggle(false)}
                    >
                      <ListItemIcon>
                        <SignInIcon />
                      </ListItemIcon>
                      <ListItemText primary="Signup" />
                    </ListItemButton>
                  </List>
                </Stack>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicNavigation;
