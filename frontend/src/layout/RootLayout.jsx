import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const RootLayout = () => {
  return (
    <Box
      maxWidth="xl"
      sx={{
        margin: "0 auto",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default RootLayout;
