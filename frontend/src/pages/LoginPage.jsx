import { Link } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "../components/formComponents/LoginForm";

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: "divider",
          width: 500,
          m: 1,
          p: { xs: 1, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
            py: 5,
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ fontWeight: "bold", letterSpacing: 3 }}
          >
            Login
          </Typography>

          <LoginForm />

          <Typography
            textAlign="center"
            sx={{ color: "inherit", textDecoration: "none" }}
            component={Link}
            to="/signup"
          >
            Don&apos;t have an account?
            <span
              style={{
                color: "#006fff",
                marginLeft: "0.5rem",
                cursor: "pointer",
              }}
            >
              Signup
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
