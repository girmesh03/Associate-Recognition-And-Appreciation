import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

const RootLayout = () => {
  return (
    <Container maxWidth="xl" disableGutters sx={{ height: "100dvh" }}>
      <Outlet />
    </Container>
  );
};

export default RootLayout;
