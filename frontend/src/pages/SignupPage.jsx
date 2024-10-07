// react import
import { Link } from "react-router-dom";

// mui import
import { Box, Paper, Stack, Typography, styled } from "@mui/material";

// components
import SignupForm from "../components/formComponents/SignupForm";

// Styled components
const SignupContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3, 0),
}));

// Styled components
const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  maxWidth: 800,
  alignSelf: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
    maxWidth: 500,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  boxShadow: "none",
  backgroundColor: "transparent",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 4,
  padding: theme.spacing(6, 4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 1),
    "@media screen and (min-width: 568px)": {
      padding: theme.spacing(6, 2),
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));

const StyledTypographyLink = styled(Typography)(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  "& span": {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(0.75),
    cursor: "pointer",
  },
}));

const SignupPage = () => {
  return (
    <SignupContainer>
      <ContentBox>
        <StyledPaper>
          <Stack direction="column" gap={2} sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: "bold", letterSpacing: 3 }}
            >
              SIGN UP
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              Be Part of a Community That Values Recognition and Appreciation.
              Sign Up Today!
            </Typography>
          </Stack>

          <SignupForm />

          <StyledTypographyLink
            className="login-link"
            component={Link}
            to="/login"
          >
            Already have an account?
            <span>Login</span>
          </StyledTypographyLink>
        </StyledPaper>
      </ContentBox>
    </SignupContainer>
  );
};

export default SignupPage;
