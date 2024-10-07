// react imports
import {
  useRouteError,
  useNavigate,
  isRouteErrorResponse,
} from "react-router-dom";
import PropTypes from "prop-types";

// mui imports
import { Box, Typography, Button } from "@mui/material";
import GobackIcon from "@mui/icons-material/FirstPageOutlined";
import RefreshIcon from "@mui/icons-material/Replay";

// not found page
import NotFoundPage from "../pages/NotFoundPage";

// Reusable Error Container Component
const ErrorContainer = ({ children }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 4,
    }}
  >
    {children}
  </Box>
);

ErrorContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

// Reusable Button
const MuiButton = ({ errorType }) => {
  const navigate = useNavigate();
  return (
    <Button
      size="small"
      variant="outlined"
      fullWidth
      startIcon={errorType === "network" ? <RefreshIcon /> : <GobackIcon />}
      onClick={() => {
        if (errorType === "network") {
          window.location.reload();
        } else {
          navigate(-1, { replace: true });
        }
      }}
    >
      Go to Home
    </Button>
  );
};

MuiButton.propTypes = {
  errorType: PropTypes.string.isRequired,
};

const RootErrorBoundary = () => {
  const error = useRouteError();

  // Function to determine if the error is a network error
  const isNetworkError = (error) => {
    return error?.status === 0 || !error?.status || error instanceof TypeError;
  };

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <ErrorContainer>
        <Box>
          <Typography variant="h3" mb={2}>
            {error.status} Error
          </Typography>
          <Typography mb={4}>
            {error.statusText || "An unexpected error occurred."}
          </Typography>
          <MuiButton errorType="other" />
        </Box>
      </ErrorContainer>
    );
  }

  if (isNetworkError(error)) {
    return (
      <ErrorContainer>
        <Box>
          <Typography variant="h3" mb={2}>
            Network Error
          </Typography>
          <Typography mb={4}>
            Please check your internet connection or try again later.
          </Typography>
          <MuiButton errorType="network" />
        </Box>
      </ErrorContainer>
    );
  }

  // General fallback for any other errors
  return (
    <ErrorContainer>
      <Box>
        <Typography variant="h3" mb={2}>
          Oops! Something went wrong.
        </Typography>
        <Typography mb={4}>
          {error?.message || "An unexpected error occurred. Please try again."}
        </Typography>
        <MuiButton errorType="other" />
      </Box>
    </ErrorContainer>
  );
};

export default RootErrorBoundary;
