// react import
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// mui import
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  VolunteerActivism as RecognitionsIcon,
  Person as PersonIcon,
  EmojiEvents as AwardIcon,
  PostAdd as PostAddIcon,
  Logout as LogoutIcon,
  AddCircleOutlineRounded as AddCircleIcon,
  ExpandLess,
  ExpandMore,
  AutoAwesome as FeaturesIcon,
  ThumbUp as TestimonialsIcon,
  Star as HighlightsIcon,
  AttachMoney as PricingIcon,
  HelpOutline as FAQIcon,
  Login as LoginIcon,
  Fingerprint as SignupIcon,
} from "@mui/icons-material";

// redux import
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authActions";

// Styled components
const StyledList = styled(List)(({ theme }) => ({
  "& .MuiListItemButton-root": {
    borderRadius: theme.shape.borderRadius,
    border: "1px solid",
    borderColor: theme.palette.divider,
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.5, 1),
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  "& .MuiListItemText-primary": {
    fontWeight: 500,
    fontSize: "12px",
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.text.primary,
    minWidth: "35px",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
    padding: theme.spacing(0, 0.5),
    margin: "auto",
  },
}));

const StyledLogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: theme.spacing(0.375),
  fontSize: "clamp(1.5rem, 1vw, 2rem)",
  color:
    theme.palette.mode === "light" ? theme.palette.primary.main : "inherit",
  textDecoration: "none",
  padding: theme.spacing(2),
}));

// nav items
const authNavItems = [
  { title: "Login", path: "/login", icon: <LoginIcon /> },
  { title: "Signup", path: "/signup", icon: <SignupIcon /> },
];

const publicNavListItems = [
  { title: "Features", icon: <FeaturesIcon />, name: "features" },
  { title: "Testimonials", icon: <TestimonialsIcon />, name: "testimonials" },
  { title: "Highlights", icon: <HighlightsIcon />, name: "highlights" },
  { title: "Pricing", icon: <PricingIcon />, name: "pricing" },
  { title: "FAQ", icon: <FAQIcon />, name: "faq" },
];

const protectedNavListItems = [
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
    path: "profile/userId",
  },
  {
    title: "Recognitions",
    icon: <RecognitionsIcon />,
    path: "recognitions",
    subItems: [
      {
        name: "Create Recognition",
        title: "Create",
        path: "recognitions/create",
        icon: <AddCircleIcon />,
      },
    ],
  },
  { title: "Nominations", icon: <PostAddIcon />, path: "nominations" },
  { title: "Winners", icon: <AwardIcon />, path: "winners" },
];

const Sidebar = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const selected = location.pathname.split("/")[1];
  const [open, setOpen] = useState({
    recognitions: false,
    nominations: false,
    dashboard: false,
  });

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExpandClick = (e, item) => {
    e.stopPropagation();
    setOpen((prevOpen) => ({ ...prevOpen, [item]: !prevOpen[item] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <>
      {currentUser ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Avatar src={currentUser?.profilePicture} alt="user profile" />
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {`${currentUser?.firstName} ${currentUser?.lastName}`}
          </Typography>
        </Stack>
      ) : (
        <StyledLogoText variant="h4" component={Link} to="/" textAlign="center">
          Monthmaster
        </StyledLogoText>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <StyledList disablePadding>
          {currentUser
            ? protectedNavListItems.map((item) =>
                item.subItems ? (
                  <div key={item.path}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <IconButton
                          onClick={(e) => handleExpandClick(e, item.path)}
                          sx={{ border: "1px solid", borderColor: "divider" }}
                        >
                          {open[item.path] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={selected === item.path}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={open[item.path]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 1 }}>
                        {item.subItems.map((subItem) => (
                          <ListItemButton
                            key={subItem.path}
                            component={Link}
                            to={subItem.path}
                            selected={selected === subItem.path.split("/")[1]}
                            sx={{
                              bgcolor:
                                subItem.title.toLowerCase() ===
                                subItem.path.split("/")[1]
                                  ? "success.main"
                                  : "inherit",
                              "&:hover": { bgcolor: "success.light" },
                            }}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ) : (
                  (item?.role ? currentUser?.role === item.role : true) && (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={
                        item.title === "Profile"
                          ? `profile/${currentUser?._id}`
                          : item.path
                      }
                      selected={selected === item.path}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                  )
                )
              )
            : publicNavListItems.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton onClick={() => scrollToSection(item.name)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
        </StyledList>

        <StyledList disablePadding sx={{ mt: "auto" }}>
          {currentUser ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            authNavItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </StyledList>
      </Box>
    </>
  );
};

export default Sidebar;
