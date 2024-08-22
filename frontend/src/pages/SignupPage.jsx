import { Box, Container } from "@mui/material";

const SignupPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pt: { xs: 7, sm: 10 },
      }}
    >
      <Box>Signup page</Box>
    </Container>
  );
};

export default SignupPage;
