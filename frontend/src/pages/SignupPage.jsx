import { Link } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import SignupForm from "../components/formComponents/SignupForm";

const SignupPage = () => {
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
          width: { xs: "100%", sm: "auto" },
          m: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: 700,
            margin: "0 auto",
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
            Signup
          </Typography>

          <SignupForm />

          <Typography
            textAlign="center"
            sx={{ color: "inherit", textDecoration: "none" }}
            component={Link}
            to="/login"
          >
            Already have an account?
            <span
              style={{
                color: "#006fff",
                marginLeft: "0.5rem",
                cursor: "pointer",
              }}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
