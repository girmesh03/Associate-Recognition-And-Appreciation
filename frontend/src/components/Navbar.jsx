// react import
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// mui import
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Typography,
  Stack,
  Badge,
  Button,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import FeaturesIcon from "@mui/icons-material/AutoAwesome";
import TestimonialsIcon from "@mui/icons-material/ThumbUp";
import HighlightsIcon from "@mui/icons-material/Star";
import PricingIcon from "@mui/icons-material/AttachMoney";
import FAQIcon from "@mui/icons-material/HelpOutline";

// redux import
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/features/auth/authSlice";
import { logout } from "../redux/features/auth/authActions";

// components
import Sidebar from "./Sidebar";

// utils
import { drawerWidth } from "../utils/constants";

// Styled components
const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
  backgroundColor: "transparent",
  backgroundImage: "none",
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: "space-between",
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
  },
}));

const StyledLogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: theme.spacing(3 / 8),
  fontSize: "clamp(1.5rem, 1vw, 2rem)",
  color:
    theme.palette.mode === "light" ? theme.palette.primary.main : "inherit",
  cursor: "pointer",
  display: "block",
  [theme.breakpoints.down("sm")]: {
    display: "none",
    "@media (orientation: landscape)": {
      display: "block",
    },
  },
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100vh",
  width: drawerWidth,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "background.paper",
    backgroundImage:
      theme.palette.mode === "light"
        ? "linear-gradient(180deg, #CEE5FD, #FFF)"
        : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
    backgroundRepeat: "no-repeat",
  },
}));

// public nav items
const publicNavListItems = [
  { title: "Features", icon: <FeaturesIcon />, name: "features" },
  { title: "Testimonials", icon: <TestimonialsIcon />, name: "testimonials" },
  { title: "Highlights", icon: <HighlightsIcon />, name: "highlights" },
  { title: "Pricing", icon: <PricingIcon />, name: "pricing" },
  { title: "FAQ", icon: <FAQIcon />, name: "faq" },
];

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated, mode } = useSelector((state) => state.auth);
  const isNoneMobile = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const route = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <StyledLogoText
            variant="h4"
            onClick={() => navigate(isAuthenticated ? "/recognitions" : "/")}
          >
            Monthmaster
          </StyledLogoText>
        </Stack>

        {isNoneMobile && route === "/" && (
          <Stack
            direction="row"
            alignItems="center"
            flexGrow={1}
            sx={{ mx: 1, display: { xs: "none", md: "flex" } }}
          >
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
          </Stack>
        )}

        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton onClick={() => dispatch(toggleMode())}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {isAuthenticated ? (
            <>
              <IconButton onClick={() => {}}>
                <SearchIcon
                  sx={{ transform: "translateX(2px) translateY(1.5px)" }}
                />
              </IconButton>
              <IconButton onClick={() => {}}>
                <Badge>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      </StyledToolbar>

      <StyledDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Sidebar />
        </Box>
      </StyledDrawer>
    </StyledAppBar>
  );
};

export default Navbar;
