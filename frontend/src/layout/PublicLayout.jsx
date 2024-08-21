import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import PublicNavigation from "../components/PublicComponents/PublicNavigation";

const PublicLayout = () => {
  return (
    <Box width="100%" height="100%">
      <PublicNavigation />
      <Outlet />
    </Box>
  );
};

export default PublicLayout;
