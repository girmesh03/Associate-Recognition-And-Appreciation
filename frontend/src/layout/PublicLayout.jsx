import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import PublicNavigation from "../components/publicComponents/PublicNavigation";

const PublicLayout = () => {
  return (
    <Box width="100%" height="100%" sx={{ overflowY: "auto" }}>
      <PublicNavigation />
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "calc(100% - 48px)",
            sm: "calc(100% - 64px)",
            md: "calc(100% - 80px)",
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicLayout;
