// react import
import { Link } from "react-router-dom";

// mui import
import { styled } from "@mui/material/styles";
import { Box, Paper, Stack, Typography } from "@mui/material";

// components
import LoginForm from "../components/formComponents/LoginForm";

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3, 0),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  maxWidth: 600,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: "transparent",
  borderRadius: theme.shape.borderRadius * 4,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(6, 2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 1),
    "@media screen and (min-width: 568px)": {
      padding: theme.spacing(6, 4),
    },
  },
}));

const StyledLinkTypography = styled(Typography)(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  textAlign: "center",
  "& span": {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(0.75),
    cursor: "pointer",
  },
}));

const LoginPage = () => {
  return (
    <LoginContainer>
      <ContentBox>
        <StyledPaper>
          <Stack direction="column" alignItems="center" gap={2}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", letterSpacing: 3 }}
            >
              Login
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              Welcome back! Log in to continue recognizing and appreciating your
              peers.
            </Typography>
          </Stack>

          <LoginForm />

          <StyledLinkTypography component={Link} to="/signup">
            Don&apos;t have an account?
            <span>Signup</span>
          </StyledLinkTypography>
        </StyledPaper>
      </ContentBox>
    </LoginContainer>
  );
};

export default LoginPage;
