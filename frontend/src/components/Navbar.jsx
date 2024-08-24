import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  AppBar,
  Badge,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/features/auth/authSlice";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const Navbar = ({ isNoneMobile, handleDrawerToggle }) => {
  const mode = useSelector((state) => state.auth.mode);
  const dispatch = useDispatch();

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
      }}
    >
      <Toolbar
        variant="regular"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            color: "text.primary",
            fontSize: "20px",
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={handleDrawerToggle(true)}
            variant="outlined"
            size="small"
            sx={{ display: isNoneMobile ? "none" : "" }}
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
              color: "primary.main",
              textDecoration: "none",
              display: { xs: "none", sm: "block" },
            }}
          >
            Monthmaster
          </Typography>
        </Stack>
        <Stack alignItems="center" direction="row">
          <IconButton onClick={() => {}}>
            <SearchIcon
              sx={{
                transform: "translateX(2px) translateY(1.5px)",
              }}
            />
          </IconButton>
          <IconButton onClick={() => {}}>
            <Badge>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={() => dispatch(toggleMode())}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  isNoneMobile: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Navbar;
