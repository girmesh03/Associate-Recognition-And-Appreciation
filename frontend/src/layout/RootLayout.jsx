// react import
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";

// mui import
import { Container, Box, useTheme, useMediaQuery, styled } from "@mui/material";
import LoadingFallback from "../components/loadingSkeletons/LoadingFallback";

// components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// utils
import { drawerWidth } from "../utils/constants";

// Styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  flexBasis: drawerWidth,
  flexShrink: 0,
  position: "sticky",
  top: 0,
  display: "flex",
  flexDirection: "column",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const MainContent = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
});

const Main = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  height: `calc(100vh - ${theme.spacing(8)})`,
  [theme.breakpoints.down("sm")]: {
    height: `calc(100vh - ${theme.spacing(7)})`,
    "@media screen and (orientation: landscape)": {
      height: `calc(100vh - ${theme.spacing(6)})`,
    },
  },
}));

const RootLayout = () => {
  const theme = useTheme();
  const isNoneMobile = useMediaQuery(theme.breakpoints.up("md"));

  const location = useLocation();
  const path = location.pathname;
  const showSidebar = path !== "/" && path !== "/login" && path !== "/signup";

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        display: isNoneMobile ? "flex" : "block",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {showSidebar && isNoneMobile && (
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
      )}
      <MainContent>
        <Navbar />
        <Main component="main">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </Main>
      </MainContent>
    </Container>
  );
};

export default RootLayout;
